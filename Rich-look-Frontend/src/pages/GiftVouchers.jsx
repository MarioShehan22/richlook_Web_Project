import React, { useState } from "react";
import { useCart } from "../store/CartContext.jsx";
import "../style/giftVouchers.css";

const fmtLKR = (n) =>
    `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

// Replace these image URLs with your real voucher images
const VOUCHERS = [
    {
        id: "gv-5000",
        title: "Gift Voucher 5000/-",
        amount: 5000,
        image:
            "https://cdn.zenegal.store/products/32140/800-gift-voucher-5000-16336806687491.jpg", // demo path
        accent: "accent-gold",
    },
    {
        id: "gv-2000",
        title: "Gift Voucher 2000/-",
        amount: 2000,
        image:
            "https://cdn.zenegal.store/products/32139/800-gift-voucher-2000-16336806176147.jpg", // demo path
        accent: "accent-green",
    },
    {
        id: "gv-500",
        title: "Gift Voucher 500/-",
        amount: 500,
        image:
            "https://cdn.zenegal.store/products/32137/800-gift-voucher-500-16336804927469.jpg", // demo path
        accent: "accent-pink",
    },
    {
        id: "gv-1000",
        title: "Gift Voucher 1000/-",
        amount: 1000,
        image:
            "https://cdn.zenegal.store/products/32138/800-gift-voucher-1000-16336805727996.jpg", // demo path
        accent: "accent-blue",
    },
];

export default function GiftVouchers() {
    const { setCartItems, formatLKR } = useCart();
    const [qty, setQty] = useState({}); // per-card quantity

    const addVoucher = (v) => {
        const q = Math.max(1, Number(qty[v.id] || 1));
        // Cart shape: keep it simple & self-contained
        setCartItems((items) => {
            const cartId = `voucher:${v.amount}`; // make it unique per amount
            const existing = items.find((it) => it._id === cartId);
            const nextQty = (existing ? Number(existing.quantity) : 0) + q;

            const base = {
                _id: cartId,
                productId: cartId, // backend can treat this as a special product
                name: v.title,
                price: v.amount,
                image: v.image,
                quantity: q,
                // If your checkout enforces size/color, keep these to bypass validation
                size: "N/A",
                color: "N/A",
            };

            return existing
                ? items.map((it) =>
                    it._id === cartId ? { ...it, quantity: nextQty } : it
                )
                : [...items, base];
        });
    };

    const onQtyChange = (id, value) =>
        setQty((s) => ({
            ...s,
            [id]: Math.max(1, Math.floor(Number(value) || 1)),
        }));

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="h4 mb-1">Gift Vouchers</h1>
                <p className="text-muted mb-0">
                    The perfect present—choose a value and add to cart.
                </p>
            </div>

            {/* Grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {VOUCHERS.map((v) => (
                    <div className="col" key={v.id}>
                        <div className={`voucher-card card h-100 border-0 shadow-sm ${v.accent}`}>
                            <div className="ratio ratio-16x9 voucher-media">
                                {v.image ? (
                                    <img
                                        src={v.image}
                                        alt={v.title}
                                        className="img-fluid object-fit-cover rounded-top"
                                    />
                                ) : (
                                    <div className="voucher-fallback rounded-top" />
                                )}
                            </div>

                            <div className="card-body text-center">
                                <div className="voucher-title mb-1">{v.title}</div>
                                <div className="voucher-price fw-bold">
                                    {formatLKR ? formatLKR(v.amount) : fmtLKR(v.amount)}
                                </div>
                            </div>

                            <div className="card-footer bg-white border-0 pt-0 pb-3">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm text-center"
                                        style={{ width: 80 }}
                                        min={1}
                                        value={qty[v.id] || 1}
                                        onChange={(e) => onQtyChange(v.id, e.target.value)}
                                    />
                                    <button
                                        className="btn btn-success btn-sm px-3"
                                        onClick={() => addVoucher(v)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Note */}
            <div className="text-center text-muted small mt-4">
                * Vouchers are redeemable in-store and online. Terms apply.
            </div>
        </div>
    );
}
