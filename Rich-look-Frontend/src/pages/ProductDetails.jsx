import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/productDetails.css';
import { useCart } from '../store/CartContext.jsx';

const fmtLKR = (n) =>
    `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function ProductDetails() {
    const { id, slug } = useParams(); // /product/:slug OR /product/id/:id
    const { setCartItems } = useCart(); // we’ll push fully-formed lines here

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState('');

    // fetch product
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                setErr('');
                const url = id ? `products/by-id/${id}` : `products/by-slug/${slug}`;
                const { data } = await axiosInstance.get(url, { signal: controller.signal });

                setProduct(data);

                const primary =
                    data.images?.find((i) => i.isPrimary)?.url ||
                    data.thumbnailUrl ||
                    data.images?.[0]?.url ||
                    '';
                setMainImage(primary);

                // default to first in-stock variant (exact size+color)
                const firstInStock = (data.variants || []).find((v) => (v.quantity || 0) > 0);
                const defColor = firstInStock?.color || data.colors?.[0] || '';
                const defSize = firstInStock?.size || data.sizes?.[0] || '';
                setSelectedColor(defColor);
                setSelectedSize(defSize);
                setQty(1);
            } catch (e) {
                if (e.name !== 'CanceledError' && e.code !== 'ERR_CANCELED') {
                    setErr('Failed to load product.');
                    console.error(e);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [id, slug]);

    const variants = useMemo(() => product?.variants || [], [product]);

    const allColors = useMemo(() => {
        const s = new Set(variants.map((v) => v.color).filter(Boolean));
        return Array.from(s);
    }, [variants]);

    const allSizes = useMemo(() => {
        const s = new Set(variants.map((v) => v.size).filter(Boolean));
        return Array.from(s);
    }, [variants]);

    // exact selected variant (only when both picked)
    const exactVariant = useMemo(
        () =>
            selectedColor && selectedSize
                ? variants.find((v) => v.color === selectedColor && v.size === selectedSize) || null
                : null,
        [variants, selectedColor, selectedSize]
    );

    // sizes enabled for current color
    const sizesForColor = useMemo(() => {
        if (!selectedColor) return allSizes.map((sz) => ({ size: sz, enabled: true }));
        const enable = new Set(
            variants.filter((v) => v.color === selectedColor && (v.quantity || 0) > 0).map((v) => v.size)
        );
        return allSizes.map((sz) => ({ size: sz, enabled: enable.has(sz) }));
    }, [allSizes, selectedColor, variants]);

    // colors enabled for current size
    const colorsForSize = useMemo(() => {
        if (!selectedSize) return allColors.map((c) => ({ color: c, enabled: true }));
        const enable = new Set(
            variants.filter((v) => v.size === selectedSize && (v.quantity || 0) > 0).map((v) => v.color)
        );
        return allColors.map((c) => ({ color: c, enabled: enable.has(c) }));
    }, [allColors, selectedSize, variants]);

    const maxQty = Math.max(0, Number(exactVariant?.quantity || 0));
    const priceToShow = Number(exactVariant?.price ?? product?.price ?? 0);
    const inStock = maxQty > 0;

    const onSelectColor = (c) => {
        setSelectedColor(c);
        // if current size isn’t valid for this color, pick first enabled
        const stillValid = sizesForColor.find((x) => x.size === selectedSize && x.enabled);
        if (!stillValid) {
            const first = sizesForColor.find((x) => x.enabled);
            if (first) setSelectedSize(first.size);
        }
        setQty(1);
    };

    const onSelectSize = (s) => {
        setSelectedSize(s);
        const stillValid = colorsForSize.find((x) => x.color === selectedColor && x.enabled);
        if (!stillValid) {
            const first = colorsForSize.find((x) => x.enabled);
            if (first) setSelectedColor(first.color);
        }
        setQty(1);
    };

    const addToCart = () => {
        if (!product) return;
        if (!selectedColor || !selectedSize) {
            alert('Please select color and size.');
            return;
        }
        if (!inStock) {
            alert('Selected variant is out of stock.');
            return;
        }

        const compositeId = `${product._id}|${selectedSize}|${selectedColor}`;
        const image = product.thumbnailUrl || product.images?.[0]?.url || '';

        setCartItems((items) => {
            const existing = items.find((it) => it._id === compositeId);
            if (existing) {
                const nextQty = Math.min(maxQty, (Number(existing.quantity) || 0) + qty);
                return items.map((it) => (it._id === compositeId ? { ...it, quantity: nextQty } : it));
            }
            return [
                ...items,
                {
                    _id: compositeId,         // cart line key (product+size+color)
                    productId: product._id,   // keep original product id as well
                    name: product.name,
                    image,
                    price: priceToShow,
                    quantity: Math.min(qty, maxQty),
                    size: selectedSize,       // IMPORTANT: top-level for Checkout validation
                    color: selectedColor,     // IMPORTANT: top-level for Checkout validation
                },
            ];
        });
    };

    if (loading) return <div className="container py-5">Loading…</div>;
    if (err || !product) return <div className="container py-5 text-danger">{err || 'Not found'}</div>;

    const thumbnails =
        (product.images || []).map((i) => i.url) ||
        (product.thumbnailUrl ? [product.thumbnailUrl] : []);

    const canAdd = !!selectedColor && !!selectedSize && inStock;

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Left: images */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <div className="row">
                        <div className="col-2 d-none d-md-block">
                            <div className="thumbnail-container">
                                {thumbnails.map((thumb, i) => (
                                    <div key={i} className="thumbnail-item mb-2">
                                        <img
                                            src={thumb}
                                            alt={`${product.name} ${i + 1}`}
                                            className={`img-fluid thumbnail-image ${mainImage === thumb ? 'active' : ''}`}
                                            onClick={() => setMainImage(thumb)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-10 col-12">
                            <div className="main-image-container">
                                {mainImage && (
                                    <img src={mainImage} alt={product.name} className="img-fluid main-product-image" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: details */}
                <div className="col-lg-6 col-md-12">
                    <div className="product-info">
                        <h1 className="product-title h3 mb-2">{product.name}</h1>
                        <div className="product-meta mb-3">
                          <span className="text-muted">
                            {product.brand} {product.slug ? `• ${product.slug}` : ''}
                          </span>
                            {product.newArrival && <span className="badge bg-success ms-2">NEW</span>}
                        </div>

                        <div className="price-section mb-3">
                            <h2 className="price text-danger fw-bold mb-1">{fmtLKR(priceToShow)}</h2>
                            {product.compareAtPrice && product.compareAtPrice > priceToShow && (
                                <div className="text-muted">
                                    <del>{fmtLKR(product.compareAtPrice)}</del>
                                </div>
                            )}
                            <div className={`mt-2 ${inStock ? 'text-success' : 'text-danger'}`}>
                                {selectedColor && selectedSize
                                    ? inStock ? `In stock (${maxQty} available)` : 'Out of stock' : 'Select color & size'}
                            </div>
                        </div>

                        {/* Colors */}
                        {allColors.length > 0 && (
                            <div className="option-section mb-4">
                                <h5 className="option-title mb-3">COLOR</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {colorsForSize.map(({ color, enabled }) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`btn btn-sm ${
                                                selectedColor === color ? 'btn-primary' : 'btn-outline-secondary'
                                            }`}
                                            disabled={!enabled}
                                            onClick={() => onSelectColor(color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {allSizes.length > 0 && (
                            <div className="option-section mb-4">
                                <h5 className="option-title mb-3">SIZE</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {sizesForColor.map(({ size, enabled }) => (
                                        <button
                                            key={size}
                                            type="button"
                                            className={`btn btn-sm ${
                                                selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'
                                            }`}
                                            disabled={!enabled}
                                            onClick={() => onSelectSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Qty + actions */}
                        <div className="row mb-4 rounded p-3">
                            <div className="col-md-4 col-6 mb-3">
                                <label className="form-label fw-bold">Qty</label>
                                <input
                                    type="number"
                                    className="form-control qty-input"
                                    min={1}
                                    max={Math.max(1, maxQty || 1)}
                                    value={qty}
                                    onChange={(e) => {
                                        const v = Math.max(1, Math.min(Number(e.target.value) || 1, maxQty || 1));
                                        setQty(v);
                                    }}
                                    disabled={!inStock}
                                />
                            </div>
                            <div className="col-md-8 col-6 d-flex align-items-end">
                                <button
                                    className="btn btn-primary btn-lg me-2 flex-fill add-to-cart-btn"
                                    disabled={!canAdd}
                                    onClick={addToCart}
                                >
                                    ADD TO CART
                                </button>
                                {/*<button className="btn btn-outline-secondary wishlist-btn" type="button" title="Add to wishlist">*/}
                                {/*    <i className="far fa-heart"></i>*/}
                                {/*</button>*/}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="description-section">
                                <h5 className="section-title mb-3">DESCRIPTION</h5>
                                <div className="description-content">{product.description}</div>
                            </div>
                        )}

                        {/* Delivery */}
                        <div className="delivery-section my-4">
                            <h5 className="section-title mb-3">DELIVERY</h5>
                            <div className="delivery-info">
                                <div className="mb-2">
                                    <span className="text-muted">Get the estimated delivery fee</span>
                                    <a href="#" className="text-primary text-decoration-none ms-1">Select city</a>
                                </div>
                                <div className="delivery-details">
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-clock text-muted me-2"></i>
                                        <span>Processing Time: 5 days</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <i className="fas fa-store text-muted me-2"></i>
                                        <span>Store Pickup: Not available</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-truck text-success me-2"></i>
                                        <span>Islandwide Delivery: Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End details */}
                    </div>
                </div>
            </div>
        </div>
    );
}
