const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
    },
    { _id: false }
);

// Stock per variant (size + color)
const variantSchema = new mongoose.Schema(
    {
        sku: { type: String, trim: true },
        size: {
            type: String,
            trim: true,
            // Add/edit sizes as needed
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size','5 - 6 Years','7 - 8 Years','9 - 10 Years','11 - 12 Years'],
            required: true,
        },
        color: { type: String, trim: true, required: true },
        quantity: { type: Number, min: 0, default: 0 },
        price: { type: Number, min: 0 },
        barcode: { type: String, trim: true },
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        // Basics
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true, index: true, trim: true },
        description: { type: String, required: true, trim: true },

        // Pricing
        price: { type: Number, required: true, min: 0 },
        compareAtPrice: { type: Number, min: 0 },

        // Brand & taxonomy
        brand: { type: String, required: true, trim: true, index: true },
        category: {
            type: String,
            required: true,
            trim: true,
            // Customize to your catalog structure
            enum: [
                'Tops',
                'Bottoms',
                'Dresses',
                'Saree',
                'Kurta',
                'Suits',
                'Outerwear',
                'Accessories',
                'Footwear',
                'Kids',
                'Other',
                `T-Shirts`,
                'Nightwear',
                'Shirt',
                "Pants & Trousers"
            ],
            index: true,
        },

        // Occasions / Collections (Party, Wedding, etc.)
        occasions: {
            type: [String],
            default: [],
            enum: ['Party', 'Wedding', 'Casual', 'Formal', 'Workwear', 'Festive', 'Beachwear','Religious Festival','Nightwear','Office Wear'],
            index: true,
        },

        // Flags
        newArrival: { type: Boolean, default: false, index: true },
        arrivalDate: { type: Date }, // helps “new this week/month” logic
        isActive: { type: Boolean, default: true, index: true }, // soft visibility flag

        // Media
        images: { type: [imageSchema], default: [] },
        thumbnailUrl: { type: String }, // quick-list image

        // Variants (holds size/color/quantity/price)
        variants: {
            type: [variantSchema],
            default: [],
            validate: v => Array.isArray(v),
        },

        // Derived inventory totals (kept in sync via pre-save)
        totalQuantity: { type: Number, default: 0, min: 0, index: true },

        // Helpful filters
        colors: { type: [String], default: [], index: true },
        sizes: {
            type: [String],
            default: [],
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size','5 - 6 Years','7 - 8 Years','9 - 10 Years','11 - 12 Years'],
            index: true,
        },
        gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids', ''], default: '' },
        material: { type: String, trim: true },
        care: { type: String, trim: true },
        season: { type: String, trim: true },

        // SEO
        metaTitle: { type: String, trim: true },
        metaDescription: { type: String, trim: true },

        // Misc
        tags: { type: [String], default: [], index: true },
    },
    { timestamps: true }
);

/** Indexes for faster filters & search */
productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ brand: 1, category: 1, totalQuantity: 1, newArrival: 1 });
function inferGenderFromProduct(p) {
    const hay = [
        p.brand, p.category, p.name,
        Array.isArray(p.tags) ? p.tags.join(' ') : ''
    ].join(' ').toLowerCase();

    // Baby/Toddler first (more specific)
    if (/(baby|infant|toddler|newborn)/i.test(hay)) return 'Kids';
    // Kids (girls/boys/children)
    if (/(kid|kids|child|children|youth|girl|girls|boy|boys)/i.test(hay)) return 'Kids';
    // Explicit category shortcut
    if ((p.category || '').toLowerCase() === 'kids') return 'Kids';

    const hasWomen = /(women'?s|woman|lad(y|ies)|female|womenswear)/i.test(hay);
    const hasMen   = /(men'?s|man|male|menswear)/i.test(hay);

    if (hasWomen && !hasMen) return 'Women';
    if (hasMen && !hasWomen) return 'Men';
    return 'Unisex';
}
/** Keep helper arrays/colors/sizes and totalQuantity in sync with variants */
productSchema.pre('save', function (next) {
    const p = this;

    // totalQuantity from variants
    p.totalQuantity = (p.variants || []).reduce((sum, v) => sum + (v.quantity || 0), 0);

    // normalize colors/sizes from variants if not explicitly set
    const sizes = new Set(p.sizes);
    const colors = new Set(p.colors);
    for (const v of p.variants) {
        if (v.size) sizes.add(v.size);
        if (v.color) colors.add(v.color);
    }
    p.sizes = Array.from(sizes);
    p.colors = Array.from(colors);

    // auto newArrival if arrivalDate is recent (e.g., last 30 days) and not manually set
    if (!p.newArrival && p.arrivalDate) {
        const days = Math.floor((Date.now() - p.arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 30) p.newArrival = true;
    }

    // basic slug if missing
    if (!p.slug && p.name) {
        p.slug = p.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    if (!p.gender || p.gender === '') {
        p.gender = inferGenderFromProduct(p);
    }

    next();
});

productSchema.virtual('inStock').get(function () {
    return this.totalQuantity > 0;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;