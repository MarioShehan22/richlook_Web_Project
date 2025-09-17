import { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function formatCurrency(n = 0) {
    return `Rs. ${Number(n).toLocaleString()}`;
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({ totals: {}, today: {} });
    const [revenue, setRevenue] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [ov, rev, top, rec] = await Promise.all([
                    axiosInstance.get('/admin/metrics/overview?tz=Asia/Colombo'),
                    axiosInstance.get('/admin/metrics/revenue?range=30d&groupBy=day&tz=Asia/Colombo'),
                    axiosInstance.get('/admin/metrics/top-products?range=30d&limit=5'),
                    axiosInstance.get('/admin/metrics/recent-orders?limit=8'),
                ]);
                setKpis(ov.data);
                setRevenue(rev.data.points.map(p => ({
                    date: new Date(p.date).toLocaleDateString(),
                    revenue: p.revenue,
                    orders: p.orders
                })));
                setTopProducts(top.data.items || []);
                setRecentOrders(rec.data.orders || []);
            } catch (e) {
                console.error(e);
                alert('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="container py-5">Loading…</div>;

    return (
        <div className="container py-4">
            <h1 className="h4 fw-bold mb-4">Admin Dashboard</h1>

            {/* KPI cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="text-muted small">Total Users</div>
                            <div className="fs-3 fw-bold">{kpis.totals.users || 0}</div>
                            <div className="text-success small mt-2">+{kpis.today.newUsers || 0} today</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="text-muted small">Total Products</div>
                            <div className="fs-3 fw-bold">{kpis.totals.products || 0}</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="text-muted small">Total Orders</div>
                            <div className="fs-3 fw-bold">{kpis.totals.orders || 0}</div>
                            <div className="text-primary small mt-2">+{kpis.today.orders || 0} today</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <div className="text-muted small">Today Revenue</div>
                            <div className="fs-3 fw-bold">{formatCurrency(kpis.today.revenue || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue chart */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="h6 mb-0">Revenue (last 30 days)</h2>
                    </div>
                    <div style={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <AreaChart data={revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v/1000).toFixed(1)}k` : v)} />
                                <Tooltip formatter={(v) => formatCurrency(v)} />
                                <Area type="monotone" dataKey="revenue" stroke="#198754" fill="#198754" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top products + Recent orders */}
            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h2 className="h6 mb-3">Top Products (30d)</h2>
                            {topProducts.length === 0 && <div className="text-muted">No data</div>}
                            <ul className="list-group list-group-flush">
                                {topProducts.map((p) => (
                                    <li key={p.productId} className="list-group-item d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            {p.thumbnailUrl && (
                                                <img src={p.thumbnailUrl} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} className="me-2" />
                                            )}
                                            <div>
                                                <div className="fw-semibold">{p.name}</div>
                                                <div className="text-muted small">{p.qty} sold</div>
                                            </div>
                                        </div>
                                        <div className="fw-bold">{formatCurrency(p.revenue)}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h2 className="h6 mb-3">Recent Orders</h2>
                            {recentOrders.length === 0 && <div className="text-muted">No orders yet</div>}
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th className="text-end">Total</th>
                                        <th>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o._id}>
                                            <td className="fw-semibold">{o._id.slice(-6).toUpperCase()}</td>
                                            <td>
                                                <div className="small">{o.userId?.name || '—'}</div>
                                                <div className="text-muted small">{o.userId?.email || '—'}</div>
                                            </td>
                                            <td className="text-end fw-bold">{formatCurrency(o.totalAmount)}</td>
                                            <td className="small">{new Date(o.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* You can add a "View all" link to your orders page */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}