import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../store/WishlistContext.jsx";
import { useCart } from "../store/CartContext.jsx";
import "../style/wishlist.css";

export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart, formatLKR } = useCart();

    const handleAddToCart = (it) => {
        // If the product has variants but none selected yet, send them to product page
        if (Array.isArray(it.variants) && it.variants.length && !it.variant) {
            const to = it.slug ? `/product/${it.slug}` : `/products/id/${it._id}`;
            navigate(to);
            return;
        }
        addToCart(it);
    };

    if (!wishlistItems.length) {
        return (
            <div className="container py-5">
                <div className="wl-empty">
                    <div className="wl-empty-art" aria-hidden />
                    <h1 className="h5 mt-3 mb-2">Your wishlist is empty</h1>
                    <p className="text-muted mb-4">
                        Save items you love and add them to your cart anytime.
                    </p>
                    <Link to="/" className="btn btn-success">
                        Browse products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                <div>
                    <h1 className="h4 mb-1 wl-title">Your Wishlist</h1>
                    <div className="text-muted small">
                        {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={clearWishlist}
                        title="Remove all"
                    >
                        Clear wishlist
                    </button>
                    <Link to="/products" className="btn btn-outline-secondary btn-sm">
                        Continue shopping
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <div className="wl-grid">
                {wishlistItems.map((it) => {
                    const key = it._id || it.id;
                    const to = it.slug ? `/product/${it.slug}` : `/products/id/${it._id}`;
                    const img =
                        it.image ||
                        it.thumbnailUrl ||
                        it.images?.[0]?.url ||
                        "https://via.placeholder.com/600x800?text=No+Image";
                    const price = Number(it.price) || 0;

                    return (
                        <div className="wl-card" key={key}>
                            <div className="wl-media">
                                <Link to={to} className="wl-media-link">
                                    <img src={img} alt={it.name} />
                                </Link>

                                {/* Hover actions */}
                                <div className="wl-actions">
                                    <button
                                        className="btn btn-success btn-sm w-100"
                                        onClick={() => handleAddToCart(it)}
                                    >
                                        Add to cart
                                    </button>
                                    <button
                                        className="btn btn-light btn-sm w-100"
                                        onClick={() => removeFromWishlist(it._id || it.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="wl-body">
                                <Link to={to} className="wl-name text-decoration-none">
                                    {it.name}
                                </Link>
                                <div className="wl-price">
                                    {formatLKR ? formatLKR(price) : `Rs. ${price.toLocaleString()}`}
                                </div>

                                {/* Meta (optional) */}
                                {(it.brand || it.category) && (
                                    <div className="wl-meta text-muted">
                                        {[it.brand, it.category].filter(Boolean).join(" • ")}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}