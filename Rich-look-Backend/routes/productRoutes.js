const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
require('mongoose');
const {isValidObjectId, Types} = require("mongoose");

router.post('/add', async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            compareAtPrice,
            brand,
            category,
            images = [],
            thumbnailUrl,
            variants = [],
            occasions = [], // e.g. ["Party","Wedding"]
            arrivalDate,
            newArrival,
            isActive = true,
            tags = [],
            gender,
            material,
            care,
            season,
            metaTitle,
            metaDescription,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            compareAtPrice,
            brand,
            category,
            images,
            thumbnailUrl,
            variants,
            occasions,
            arrivalDate,
            newArrival,
            isActive,
            tags,
            gender,
            material,
            care,
            season,
            metaTitle,
            metaDescription,
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});

// GET /products
router.get('/', async (req, res) => {
    try {
        const {
            q,
            brand,
            category,
            occasions,
            size,
            color,
            minPrice,
            maxPrice,
            newArrival,
            inStock,
            gender,
            includeUnisex = 'false',
            sort = '-createdAt',
            page = 1,
            limit = 20,
            onlyActive = 'true',
            fields,
            ids,
        } = req.query;

        // helpers
        const toList = (v) =>
            Array.isArray(v)
                ? v
                : String(v || '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);

        const filters = {};
        if (onlyActive === 'true') filters.isActive = true;

        // text search
        const projection = {};
        let scoreSortNeeded = false;
        if (q) {
            filters.$text = { $search: q };
            projection.score = { $meta: 'textScore' };
            scoreSortNeeded = true;
        }

        // filter by explicit _ids (comma separated)
        if (ids) {
            const list = toList(ids)
                .filter(isValidObjectId)
                .map(id => new Types.ObjectId(id));
            if (list.length) filters._id = { $in: list };
        }

        // brand/category
        if (brand)    filters.brand    = { $in: toList(brand) };
        if (category) filters.category = { $in: toList(category) };

        // occasions
        if (occasions) filters.occasions = { $in: occasions }; // OR semantics

        // sizes/colors via top-level arrays (synced from variants)
        if (size)  filters.sizes  = { $in: toList(size) };
        if (color) filters.colors = { $in: toList(color) };

        // price range
        const minP = Number(minPrice);
        const maxP = Number(maxPrice);
        if (Number.isFinite(minP) || Number.isFinite(maxP)) {
            filters.price = {};
            if (Number.isFinite(minP)) filters.price.$gte = minP;
            if (Number.isFinite(maxP)) filters.price.$lte = maxP;
        }

        // new arrivals
        if (newArrival === 'true') filters.newArrival = true;

        // stock
        if (inStock === 'true')  filters.totalQuantity = { $gt: 0 };
        if (inStock === 'false') filters.totalQuantity = { $eq: 0 };

        // gender (+ optional Unisex)
        if (gender) {
            const g = new Set(toList(gender));
            if (includeUnisex === 'true') g.add('Unisex');
            filters.gender = { $in: Array.from(g) };
        }

        // sorting
        // if text search, score should be first sort unless the client explicitly overrides
        const sortObj = {};
        if (scoreSortNeeded) sortObj.score = { $meta: 'textScore' };

        if (sort) {
            sort.split(',').forEach(f => {
                const s = f.trim();
                if (!s) return;
                if (s.startsWith('-')) sortObj[s.slice(1)] = -1;
                else sortObj[s] = 1;
            });
        }

        // pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const lim = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
        const skip = (pageNum - 1) * lim;

        // field projection
        let selectStr = '';
        if (fields) {
            selectStr = toList(fields).join(' ');
        }

        const [items, total] = await Promise.all([
            Product.find(filters, projection)  // include text score if present
                .select(selectStr)
                .sort(sortObj)
                .skip(skip)
                .limit(lim),
            Product.countDocuments(filters),
        ]);

        res.status(200).json({
            page: pageNum,
            limit: lim,
            total,
            pages: Math.ceil(total / lim),
            items,
        });
    } catch (err) {
        console.error('GET /products error:', err);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});


/** Get a single product by id or slug */
router.get('/find-By-id/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId).lean();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        console.error(error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

router.get('/by-slug/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

/** Update */
router.put('/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated successfully', product: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

/** Delete */
router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// routes/productRoutes.js
router.get('/facets', async (req, res) => {
    const fields = (req.query.fields || 'brand,category,colors,sizes,occasions,gender')
        .split(',').map(s => s.trim());
    const {
        gender,
        inStock,
        newArrival,
        onlyActive = 'true',
        includeUnisex = 'false',   // << NEW: opt-in flag
        groupByGender = 'false',   // << used in section 2 (optional)
    } = req.query;

    const filters = {};
    if (onlyActive === 'true') filters.isActive = true;

    // STRICT by default; only include Unisex when asked
    if (gender) {
        const selected = gender.split(',').map(s => s.trim());
        const list = new Set(selected);
        if (includeUnisex === 'true') list.add('Unisex');      // << opt-in
        filters.gender = { $in: Array.from(list) };
    }

    if (newArrival === 'true') filters.newArrival = true;
    if (inStock === 'true') filters.totalQuantity = { $gt: 0 };
    if (inStock === 'false') filters.totalQuantity = { $eq: 0 };

    // Build the facet pipelines
    const facetStage = {};
    if (fields.includes('brand'))    facetStage.brand    = [{ $group: { _id: '$brand', count: { $sum: 1 } } }, { $sort: { count:-1, _id:1 } }];
    if (fields.includes('category')) facetStage.category = [{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count:-1, _id:1 } }];
    if (fields.includes('colors'))   facetStage.colors   = [{ $unwind: '$colors' }, { $group: { _id:'$colors', count:{ $sum:1 } } }, { $sort:{ count:-1, _id:1 } }];
    if (fields.includes('sizes'))    facetStage.sizes    = [{ $unwind: '$sizes' },  { $group: { _id:'$sizes',  count:{ $sum:1 } } }, { $sort:{ count:-1, _id:1 } }];
    if (fields.includes('occasions'))facetStage.occasions= [{ $unwind: '$occasions' }, { $group:{ _id:'$occasions', count:{ $sum:1 } } }, { $sort:{ count:-1, _id:1 } }];
    if (fields.includes('gender'))   facetStage.gender   = [{ $group: { _id: '$gender', count: { $sum: 1 } } }, { $sort: { count:-1, _id:1 } }];

    // Optional: grouped output by gender (see section 2)
    if (groupByGender === 'true') {
        const genders = ['Men','Women','Unisex','Kids'];
        const genderFacets = {};
        for (const g of genders) {
            genderFacets[g] = [
                { $match: { ...filters, gender: g } },
                { $facet: facetStage }
            ];
        }
        const [resFacet] = await Product.aggregate([{ $facet: genderFacets }]);

        // Flatten each group's arrays to just values (keep counts if you like)
        const grouped = {};
        for (const g of genders) {
            grouped[g] = {};
            for (const k of Object.keys(resFacet[g] || {})) {
                grouped[g][k] = (resFacet[g][k] || []).map(x => x._id);
            }
            grouped[g].counts = resFacet[g]; // keep counts by facet if you need
        }
        return res.json(grouped);
    }

    // Default (ungrouped) facets for the current filter
    const [result] = await Product.aggregate([{ $match: filters }, { $facet: facetStage }]);
    const out = {};
    for (const k of Object.keys(result || {})) out[k] = result[k].map(x => x._id);
    out.counts = result;
    res.json(out);
});

module.exports = router;