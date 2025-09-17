import { useEffect, useState } from 'react';
import axiosInstance from "../config/axiosConfig.js";
const STATUS = ['Pending', 'Shipped', 'Delivered'];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage]     = useState(1);
    const [pages, setPages]   = useState(1);
    const [total, setTotal]   = useState(0);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [q, setQ] = useState('');

    const load = async (p = 1) => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('orders/find-All', {
                params: {
                    page: p,
                    status: statusFilter || undefined,
                    q: q || undefined,
                },
            });
            setOrders(data.orders || []);
            setPage(data.page || 1);
            setPages(data.pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            alert(e?.response?.data?.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(1); }, [statusFilter]);

    const changeStatus = async (orderId, status) => {
        try {
            const { data } = await axiosInstance.put(`orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => (o._id === orderId ? data.order : o)));
        } catch (e) {
            alert(e?.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="container py-4">
            <h2 className="h4 mb-3">Orders</h2>

            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <input
                    className="form-control"
                    placeholder="Search by order id / customer name / email"
                    style={{ maxWidth: 360 }}
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                <button className="btn btn-outline-secondary" onClick={() => load(1)} disabled={loading}>
                    Search
                </button>

                <select
                    className="form-select w-auto ms-auto"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All statuses</option>
                    {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {loading ? 'Loading…' : (
                <>
                    {orders.length === 0 ? (
                        <div className="text-muted">No orders.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Products</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Placed</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(o => (
                                    <tr key={o._id}>
                                        <td className="text-nowrap">{o._id}</td>
                                        <td>
                                            {o.userId?.name || '-'}
                                            <br />
                                            <small className="text-muted">{o.userId?.email || '-'}</small>
                                        </td>
                                        <td style={{ minWidth: 320 }}>
                                            {o.products?.map((p, i) => {
                                                const prod = p.productId;
                                                const thumb =
                                                    prod?.thumbnailUrl ||
                                                    (prod?.images?.[0]?.url || '');
                                                const unit = Number(p.price) || 0;
                                                const qty  = Number(p.quantity) || 0;
                                                const line = unit * qty;
                                                return (
                                                    <div key={i} className="d-flex align-items-center gap-2 mb-1">
                                                        {thumb ? (
                                                            <img
                                                                src={thumb}
                                                                alt=""
                                                                style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 32, height: 32, background: '#eee', borderRadius: 6 }} />
                                                        )}
                                                        <div className="small">
                                                            <div className="fw-semibold">{prod?.name || '(product)'}</div>
                                                            <div className="text-muted">
                                                                Qty: {qty} • Unit: Rs. {unit.toLocaleString()} • Line: Rs. {line.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </td>
                                        <td className="fw-bold">Rs. {Number(o.totalAmount).toLocaleString()}</td>
                                        <td style={{ minWidth: 180 }}>
                                            <select
                                                className="form-select form-select-sm"
                                                value={o.status}
                                                onChange={e => changeStatus(o._id, e.target.value)}
                                            >
                                                {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="text-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="text-muted small">Total: {total}</div>
                        <div className="btn-group">
                            <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
                            <button className="btn btn-outline-secondary btn-sm" disabled>{page} / {pages}</button>
                            <button className="btn btn-outline-secondary btn-sm" disabled={page >= pages} onClick={() => load(page + 1)}>Next</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
