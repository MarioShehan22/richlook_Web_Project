import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../config/axiosConfig.js";

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleString();
    } catch {
        return dateStr || "-";
    }
}

function formatMoney(n) {
    const num = Number(n || 0);
    return num.toLocaleString(undefined, { style: "currency", currency: "LKR" });
    // If you want USD: currency: "USD"
}

function statusClass(status) {
    const s = String(status || "").toLowerCase();
    if (["delivered", "completed"].includes(s)) return "bg-success";
    if (["processing", "confirmed"].includes(s)) return "bg-primary";
    if (["pending"].includes(s)) return "bg-warning text-dark";
    if (["cancelled", "canceled", "failed"].includes(s)) return "bg-danger";
    return "bg-secondary";
}

export default function OrderHistory() {
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");
    const [orders, setOrders] = useState([]);

    // simple filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("ALL");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setMsg("");
            try {
                const getMyOrders = () => axiosInstance.get("/orders/");
                const { data } = await getMyOrders();
                setOrders(Array.isArray(data) ? data : data?.orders || []);
            } catch (e) {
                console.error(e);
                setMsg(e?.response?.data?.message || "Failed to load orders.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        return (orders || []).filter((o) => {
            const st = String(o.status || "").toUpperCase();
            const matchStatus = status === "ALL" ? true : st === status;
            const hay = [
                o._id,
                o.orderNo,
                o.status,
                o.payment?.method,
                o.payment?.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchQuery = query ? hay.includes(query) : true;
            return matchStatus && matchQuery;
        });
    }, [orders, q, status]);

    const statusOptions = useMemo(() => {
        const set = new Set((orders || []).map((o) => String(o.status || "").toUpperCase()).filter(Boolean));
        return ["ALL", ...Array.from(set)];
    }, [orders]);

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                    <h2 className="h4 mb-1">My Orders</h2>
                    <div className="text-muted small">Track your purchases and order status.</div>
                </div>

                <div className="d-flex gap-2">
                    <Link to="/shop" className="btn btn-outline-secondary">
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {msg && <div className="alert alert-warning">{msg}</div>}

            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body d-flex flex-wrap gap-2 align-items-center">
                    <input
                        className="form-control"
                        style={{ maxWidth: 360 }}
                        placeholder="Search by order id / status / payment..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <select
                        className="form-select"
                        style={{ maxWidth: 220 }}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>
                                {s === "ALL" ? "All statuses" : s}
                            </option>
                        ))}
                    </select>

                    <div className="ms-auto text-muted small">
                        Showing <b>{filtered.length}</b> of <b>{orders.length}</b>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status" />
                    <div className="mt-2 text-muted">Loading orders...</div>
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="h5 mb-2">No orders found</div>
                        <div className="text-muted mb-3">
                            You haven’t placed any orders yet (or your filters are too strict).
                        </div>
                        <Link to="/shop" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            )}

            {/* Desktop table */}
            {!loading && filtered.length > 0 && (
                <>
                    <div className="d-none d-md-block">
                        <div className="card">
                            <div className="table-responsive">
                                <table className="table mb-0 align-middle">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Order</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th className="text-end">Items</th>
                                        <th className="text-end">Total</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((o) => (
                                        <tr key={o._id}>
                                            <td>
                                                <div className="fw-semibold">{o.orderNo || o._id}</div>
                                                <div className="text-muted small">#{String(o._id).slice(-8)}</div>
                                            </td>
                                            <td className="text-muted">{formatDate(o.createdAt)}</td>
                                            <td>
                          <span className={`badge ${statusClass(o.status)}`}>
                            {String(o.status || "UNKNOWN").toUpperCase()}
                          </span>
                                            </td>
                                            <td className="text-end">{o.items?.length ?? o.orderItems?.length ?? 0}</td>
                                            <td className="text-end fw-semibold">{formatMoney(o.total || o.totalAmount || o.grandTotal)}</td>
                                            <td className="text-end">
                                                <Link className="btn btn-sm btn-outline-primary" to={`/orders/${o._id}`}>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Mobile cards */}
                    <div className="d-md-none">
                        <div className="row g-3">
                            {filtered.map((o) => (
                                <div key={o._id} className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <div className="fw-semibold">{o.orderNo || o._id}</div>
                                                    <div className="text-muted small">{formatDate(o.createdAt)}</div>
                                                </div>
                                                <span className={`badge ${statusClass(o.status)}`}>
                          {String(o.status || "UNKNOWN").toUpperCase()}
                        </span>
                                            </div>

                                            <hr />

                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">Items</div>
                                                <div className="fw-semibold">{o.items?.length ?? o.orderItems?.length ?? 0}</div>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <div className="text-muted">Total</div>
                                                <div className="fw-semibold">{formatMoney(o.total || o.totalAmount || o.grandTotal)}</div>
                                            </div>

                                            <div className="mt-3">
                                                <Link className="btn btn-outline-primary w-100" to={`/orders/${o._id}`}>
                                                    View Order
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
