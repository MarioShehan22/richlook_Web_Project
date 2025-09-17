import React from 'react';
import { FaTrash, FaLock, FaCommentDots } from 'react-icons/fa';
import { useCart } from '../store/CartContext.jsx';
import '../style/CartPage.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Alert from '../components/Alert';

const CartPage = () => {
    const {
        cartItems,
        incrementQty,
        decrementQty,
        removeItem,
        subtotal,
        formatLKR,
        setCartItems,
    } = useCart();

    const navigate = useNavigate();

    const handleQtyChange = (lineId, value) => {
        const next = Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
        setCartItems((prev) =>
            prev.map((item) => (item._id === lineId ? { ...item, quantity: next } : item))
        );
    };

    return (
        <div className="container cart-page">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {cartItems.length === 0 ? (
                        <div className="text-center">
                            <Alert
                                type="info"
                                title="Your cart is empty"
                                message="Add some products to get started!"
                            />
                            <Button
                                variant="primary"
                                size="lg"
                                className="mt-4"
                                onClick={() => navigate('/')}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const key = item._id; // composite: productId|size|color
                            const img =
                                item.image ||
                                item.thumbnailUrl ||
                                (item.images && item.images[0]?.url) ||
                                '';

                            const qty = Number(item.quantity) || 1;
                            const price = Number(item.price) || 0;
                            const lineTotal = price * qty;

                            return (
                                <div className="cart-item-card" key={key}>
                                    <div className="row align-items-start g-3">
                                        <div className="col-3 col-md-2">
                                            {img && <img src={img} alt={item.name} className="cart-item-image" />}
                                        </div>

                                        <div className="col-9 col-md-7 cart-item-info">
                                            <strong className="d-block fs-5">{item.name}</strong>

                                            {(item.color || item.size) && (
                                                <div className="text-muted small">
                                                    {item.color ? <>Color: {item.color}</> : null}
                                                    {item.color && item.size ? ' • ' : ''}
                                                    {item.size ? <>Size: {item.size}</> : null}
                                                </div>
                                            )}

                                            <div className="cart-model-date">
                                                {item.model ? (
                                                    <>
                                                        Model: {item.model}
                                                        <br />
                                                    </>
                                                ) : null}
                                                {item.expectedDate ? <>Expected Date: {item.expectedDate}</> : null}
                                            </div>
                                        </div>

                                        <div className="col-md-3 text-end">
                                            <div className="d-inline-flex align-items-center gap-2 mb-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => decrementQty(key)}
                                                    disabled={qty <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    value={qty}
                                                    min={1}
                                                    style={{ width: 60 }}
                                                    onChange={(e) => handleQtyChange(key, parseInt(e.target.value, 10))}
                                                    aria-label="Quantity"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => incrementQty(key)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="cart-price">{formatLKR(price)}</div>
                                            <div className="cart-price">{formatLKR(lineTotal)}</div>

                                            <button
                                                type="button"
                                                className="cart-remove-btn d-inline-flex align-items-center mt-1"
                                                onClick={() => removeItem(key)}
                                            >
                                                <FaTrash className="me-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="col-lg-4">
                    <div className="cart-summary-card">
                        <div className="cart-summary-line">
                            <strong>Cart Summary</strong>
                            <span>
                                {cartItems.reduce((count, it) => count + (Number(it.quantity) || 0), 0)} items
                            </span>
                        </div>

                        <div className="cart-summary-line">
                            <span>Sub-total:</span>
                            <span>{formatLKR(subtotal)}</span>
                        </div>

                        <div className="cart-summary-line">
                            <span>Delivery Charges:</span>
                            <span>-</span>
                        </div>

                        <div className="cart-summary-total">
                            <span>Total:</span>
                            <span>{formatLKR(subtotal)}</span>
                        </div>

                        <button
                            type="button"
                            className="cart-checkout-btn btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Continue to Checkout
                        </button>

                        <div className="cart-safe-message">
                            <FaLock className="me-1" /> Transactions are 100% Safe and Secure
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
