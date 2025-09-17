import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Checkout.css";
import { useCart } from "../store/CartContext.jsx";
import axiosInstance from "../config/axiosConfig.js";

const maskCard = (num = "") =>
    String(num).replace(/\s+/g, "").replace(/.(?=.{4})/g, "•");

const FLAT_SHIPPING = 0;
const FREE_SHIPPING_THRESHOLD = 0;

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, subtotal, formatLKR, setCartItems } = useCart();
    const [submitting, setSubmitting] = useState(false);
    // redirect to cart if empty
    useEffect(() => {
        if (!cartItems?.length) navigate("/cart");
    }, [cartItems, navigate]);

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [paymentFormVisible, setPaymentFormVisible] = useState(false);

    const [shippingDetails, setShippingDetails] = useState(() => {
        try {
            const saved = localStorage.getItem("shipping");
            return saved
                ? JSON.parse(saved)
                : {
                    name: "",
                    email: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    city: "",
                    province: "",
                };
        } catch {
            return {
                name: "",
                email: "",
                phone: "",
                address1: "",
                address2: "",
                city: "",
                province: "",
            };
        }
    });

    const [paymentDetails, setPaymentDetails] = useState({
        cardType: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    // persist shipping snapshot
    useEffect(() => {
        localStorage.setItem("shipping", JSON.stringify(shippingDetails));
    }, [shippingDetails]);

    const itemCount = useMemo(
        () => cartItems.reduce((n, it) => n + (Number(it.quantity) || 0), 0),
        [cartItems]
    );

    const shippingFee = useMemo(() => {
        if (FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD)
            return 0;
        return FLAT_SHIPPING;
    }, [subtotal]);

    const grandTotal = useMemo(
        () => subtotal + shippingFee,
        [subtotal, shippingFee]
    );

    const handleShippingChange = (e) =>
        setShippingDetails((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handlePaymentChange = (e) =>
        setPaymentDetails((s) => ({ ...s, [e.target.name]: e.target.value }));

    const submitShipping = (e) => {
        e.preventDefault();
        setIsConfirmed(true);
        setTimeout(() => setPaymentFormVisible(true), 100);
    };

    const revealPaymentForm = () => setPaymentFormVisible(true);

    const paySectionRef = useRef(null);
    useEffect(() => {
        if (paymentFormVisible) {
            paySectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [paymentFormVisible]);

    const submitPayment = async (e) => {
        e.preventDefault();
        if (!isConfirmed) return alert("Please confirm shipping information first.");
        if (!cartItems.length) return alert("Your cart is empty.");

        // helper: get real productId
        const resolveProductId = (it) => {
            if (it.productId) return String(it.productId);
            const idStr = String(it._id || it.id || "");
            return idStr.includes("|") ? idStr.split("|")[0] : idStr; // fallback for old cart lines
        };

        // validate variants (supports both shapes)
        const missing = cartItems.filter((it) => {
            const size  = it.variant?.size  ?? it.size;
            const color = it.variant?.color ?? it.color;
            return !size || !color;
        });
        if (missing.length) {
            const names = missing.map(m => `• ${m.name}`).join("\n");
            alert(`Please select size and color for:\n${names}`);
            return;
        }

        // Build items payload expected by POST /orders/place
        const items = cartItems.map((it) => {
            const size  = it.variant?.size  ?? it.size;
            const color = it.variant?.color ?? it.color;
            const quantity = Math.max(1, parseInt(it.quantity, 10) || 1);
            return {
                productId: resolveProductId(it),
                quantity,
                size,
                color,
            };
        });

        try {
            setSubmitting(true);
            const { data } = await axiosInstance.post("orders/place", { items });

            // save a light receipt locally (optional)
            const saved = {
                orderId: data?.order?._id || data?.order?.id,
                createdAt: data?.order?.createdAt || new Date().toISOString(),
                items: cartItems,
                amounts: { subtotal, shipping: shippingFee, total: grandTotal },
                shipping: shippingDetails,
                payment: {
                    cardType: paymentDetails.cardType,
                    cardMasked: maskCard(paymentDetails.cardNumber),
                    expiryDate: paymentDetails.expiryDate,
                },
                status: data?.order?.status || "Pending",
            };
            localStorage.setItem("lastOrder", JSON.stringify(saved));

            setCartItems([]); // clear cart
            alert("Payment successful! Your order has been placed.");
            navigate("/");
        } catch (err) {
            console.error("Order place error (full):", err?.response || err);
            const msg = err?.response?.data?.message || err.message || "Error placing order";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="checkout-wrapper container py-4">
            <h1 className="checkout-heading h3 fw-bold mb-3">Checkout</h1>

            {/* Bootstrap grid */}
            <div className="row g-4">
                {/* LEFT */}
                <div className="col-12 col-lg-8">
                    <div className="checkout-card card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="step-header mb-3">
                                <span className="step-badge">1</span>
                                <span className="step-title">Shipping Information</span>
                            </div>

                            {!isConfirmed ? (
                                <form id="shipping-form" onSubmit={submitShipping}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            First and last name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            className="form-control"
                                            required
                                            value={shippingDetails.name}
                                            onChange={handleShippingChange}
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="email" className="form-label">
                                                E-mail address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className="form-control"
                                                required
                                                value={shippingDetails.email}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="phone" className="form-label">
                                                Mobile number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="form-control"
                                                required
                                                value={shippingDetails.phone}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="address1" className="form-label">
                                            Address line 1
                                        </label>
                                        <input
                                            id="address1"
                                            name="address1"
                                            className="form-control"
                                            required
                                            value={shippingDetails.address1}
                                            onChange={handleShippingChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="address2" className="form-label">
                                            Address line 2
                                        </label>
                                        <input
                                            id="address2"
                                            name="address2"
                                            className="form-control"
                                            value={shippingDetails.address2}
                                            onChange={handleShippingChange}
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="city" className="form-label">
                                                City
                                            </label>
                                            <select
                                                id="city"
                                                name="city"
                                                className="form-control"
                                                required
                                                value={shippingDetails.city}
                                                onChange={handleShippingChange}
                                            >
                                                <option value="">Select City</option>
                                                <option>Colombo</option>
                                                <option>Kandy</option>
                                                <option>Galle</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="province" className="form-label">
                                                Province
                                            </label>
                                            <select
                                                id="province"
                                                name="province"
                                                className="form-control"
                                                required
                                                value={shippingDetails.province}
                                                onChange={handleShippingChange}
                                            >
                                                <option value="">Select Province</option>
                                                <option>Western Province</option>
                                                <option>Central Province</option>
                                                <option>Southern Province</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-success w-100">
                                        Confirm shipping
                                    </button>
                                </form>
                            ) : (
                                <div id="confirm-box">
                                    <p className="mb-1">
                                        <strong>Shipping Info Added ✅</strong>
                                    </p>
                                    <div className="small text-muted">
                                        {shippingDetails.name}, {shippingDetails.address1}
                                        {shippingDetails.address2 ? `, ${shippingDetails.address2}` : ""},{" "}
                                        {shippingDetails.city}, {shippingDetails.province}.{" "}
                                        {shippingDetails.phone}
                                    </div>
                                    <div className="edit-btn-container mt-2">
                                        <button
                                            className="edit-btn"
                                            onClick={() => setIsConfirmed(false)}
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Open payment form (only after shipping confirm) */}
                    <button
                        className="btn btn-outline-success w-100 mt-3"
                        onClick={revealPaymentForm}
                        disabled={!isConfirmed}
                        title={!isConfirmed ? "Confirm shipping first" : "Fill Payment Info"}
                    >
                        Fill Payment Info
                    </button>

                    {/* Payment */}
                    {paymentFormVisible && (
                        <div
                            id="payment-box"
                            className="card border-0 shadow-sm mt-3"
                            ref={paySectionRef}
                        >
                            <div className="card-body">
                                <div className="step-header mb-3">
                                    <span className="step-badge">2</span>
                                    <span className="step-title">Payment Information</span>
                                </div>

                                <form id="payment-form" onSubmit={submitPayment}>
                                    <div className="mb-3">
                                        <label htmlFor="cardType" className="form-label">
                                            Card Type
                                        </label>
                                        <select
                                            id="cardType"
                                            name="cardType"
                                            className="form-control"
                                            required
                                            value={paymentDetails.cardType}
                                            onChange={handlePaymentChange}
                                        >
                                            <option value="">Select Card Type</option>
                                            <option value="mastercard">MasterCard</option>
                                            <option value="amex">American Express (AMEX)</option>
                                            <option value="visa">Visa</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="cardNumber" className="form-label">
                                            Card Number
                                        </label>
                                        <input
                                            id="cardNumber"
                                            name="cardNumber"
                                            className="form-control"
                                            required
                                            maxLength={19}
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) =>
                                                handlePaymentChange({
                                                    target: {
                                                        name: "cardNumber",
                                                        value: e.target.value
                                                            .replace(/[^\d ]/g, "")
                                                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                                                            .trim(),
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="expiry-date" className="form-label">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="month"
                                                id="expiry-date"
                                                name="expiryDate"
                                                className="form-control"
                                                required
                                                value={paymentDetails.expiryDate}
                                                onChange={handlePaymentChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="cvv" className="form-label">
                                                CVV
                                            </label>
                                            <input
                                                id="cvv"
                                                name="cvv"
                                                className="form-control"
                                                required
                                                maxLength={4}
                                                placeholder="123"
                                                value={paymentDetails.cvv.replace(/[^\d]/g, "")}
                                                onChange={(e) =>
                                                    handlePaymentChange({
                                                        target: {
                                                            name: "cvv",
                                                            value: e.target.value
                                                                .replace(/[^\d]/g, "")
                                                                .slice(0, 4),
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success w-100"
                                        disabled={submitting || !isConfirmed || !cartItems.length}
                                        title={!isConfirmed ? "Confirm shipping first" : ""}
                                    >
                                        {submitting ? "Placing order..." : "Submit Payment"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT — Summary */}
                <aside className="col-12 col-lg-4">
                    <div
                        className="summary-card card border-0 shadow-sm position-sticky"
                        style={{ top: 24 }}
                    >
                        <div className="card-body">
                            <div className="summary-header">
                                <span className="summary-title">Order Summary</span>
                                <span id="order-count">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
                            </div>

                            <div className="summary-items">
                                {cartItems.map((it) => {
                                    const id = it._id || it.id;
                                    const img =
                                        it.image || it.thumbnailUrl || it.images?.[0]?.url || "";
                                    const qty = Number(it.quantity) || 1;
                                    const price = Number(it.price) || 0;
                                    return (
                                        <div key={id} className="summary-item">
                                            {img ? (
                                                <img src={img} alt={it.name} />
                                            ) : (
                                                <div className="summary-thumb-fallback" />
                                            )}
                                            <div className="summary-item-info">
                                                <div className="summary-item-title">{it.name}</div>
                                                <div className="summary-item-meta">Qty: {qty}</div>
                                            </div>
                                            <div className="summary-item-price">
                                                {formatLKR(price * qty)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="summary-line">
                                <span>Sub-total</span>
                                <span>{formatLKR(subtotal)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Delivery</span>
                                <span>{shippingFee ? formatLKR(shippingFee) : "-"}</span>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <span id="order-total">{formatLKR(grandTotal)}</span>
                            </div>

                            <div className="summary-terms">
                                By clicking the button below, you are agreeing to the{" "}
                                <a href="#">Terms and Conditions</a>
                            </div>

                            <button
                                id="pay-btn"
                                className="btn btn-outline-success w-100"
                                disabled={submitting}
                                onClick={() =>
                                    isConfirmed
                                        ? setPaymentFormVisible(true)
                                        : alert("Please confirm shipping first.")
                                }
                            >
                                Continue to Pay
                            </button>

                            <div className="summary-note mt-3">
                                <i className="fa fa-lock" /> Transactions are 100% Safe and
                                Secure
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}