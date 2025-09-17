import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEye } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart, onAddToWishlist, onQuickView }) => {
    const to = product.slug ? `/product/${product.slug}` : `/product/id/${product._id}`;
    const img = product.thumbnailUrl || product.images?.[0]?.url || "";
    
    const fmtLKR = (n) =>
        `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

    const installmentAmount = Math.ceil((Number(product.price) || 0) / 3);

    return (
        <div className="rl-product-card">
            {/* Product Image */}
            <div className="rl-product-card-image">
                <img src={img} alt={product.name} />
                
                {/* Sale Badge */}
                {product.discount && (
                    <div className="rl-product-card-badge">
                        -{product.discount}%
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="rl-product-card-actions">
                    <button 
                        className="rl-btn rl-btn-icon rl-btn-sm rl-btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            onQuickView?.(product);
                        }}
                        title="Quick View"
                    >
                        <FaEye />
                    </button>
                    
                    <button 
                        className="rl-btn rl-btn-icon rl-btn-sm rl-btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToWishlist?.(product);
                        }}
                        title="Add to Wishlist"
                    >
                        <FaHeart />
                    </button>
                    
                    <button 
                        className="rl-btn rl-btn-icon rl-btn-sm rl-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.(product);
                        }}
                        title="Add to Cart"
                    >
                        <FaShoppingCart />
                    </button>
                </div>
            </div>

            {/* Product Content */}
            <div className="rl-product-card-content">
                <Link to={to} className="text-decoration-none">
                    <h3 className="rl-product-card-title">{product.name}</h3>
                </Link>
                
                <div className="rl-product-card-brand">{product.brand}</div>
                
                <div className="rl-product-card-price">
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-muted text-decoration-line-through me-2">
                            {fmtLKR(product.originalPrice)}
                        </span>
                    )}
                    {fmtLKR(product.price)}
                </div>
                
                <div className="rl-product-card-installment">
                    or 3 × {fmtLKR(installmentAmount)} with
                </div>
                
                {/* Payment Logos */}
                <div className="payment-logos-below">
                    <img 
                        src="https://www.richlook.lk/images/koko-logo.png" 
                        alt="Koko" 
                        className="payment-logo" 
                    />
                    <img 
                        src="https://www.richlook.lk/images/mintpay-logo.png" 
                        alt="Mintpay" 
                        className="payment-logo" 
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
