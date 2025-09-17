import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { deleteProduct, listProducts } from "../api/products";

export default function ProductsPage() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const q = searchParams.get("q") || "";
    const gender = searchParams.get("gender") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "-createdAt";

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await listProducts({
                q,
                gender,
                category,
                sort,
                page,
                limit: 12,
                onlyActive: "false", // show all in admin
            });
            setItems(data.items || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (e) {
            console.error(e);
            setMsg("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // eslint-disable-next-line
    }, [q, gender, category, sort, page]);

    const onSearch = (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("q", form.get("q") || "");
            next.set("page", "1");
            return next;
        });
    };

    const onDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await deleteProduct(id);
            setMsg("Product deleted.");
            fetchData();
        } catch (e) {
            console.error(e);
            setMsg("Delete failed.");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Products</h2>
                <Link to="/admin/products/new" className="btn btn-primary">+ New Product</Link>
            </div>

            {msg && <div className="alert alert-info">{msg}</div>}

            {/* Filters */}
            <form className="row g-2 align-items-end mb-3" onSubmit={onSearch}>
                <div className="col-md-4">
                    <label className="form-label">Search</label>
                    <input name="q" defaultValue={q} className="form-control" placeholder="name, brand, tags..." />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Gender</label>
                    <select
                        className="form-select"
                        value={gender}
                        onChange={(e) => {
                            setSearchParams((prev) => {
                                const next = new URLSearchParams(prev);
                                next.set("gender", e.target.value);
                                next.set("page", "1");
                                return next;
                            });
                        }}
                    >
                        <option value="">Any</option>
                        <option>Women</option>
                        <option>Men</option>
                        <option>Kids</option>
                        <option>Unisex</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Sort</label>
                    <select
                        className="form-select"
                        value={sort}
                        onChange={(e) => {
                            setSearchParams((prev) => {
                                const next = new URLSearchParams(prev);
                                next.set("sort", e.target.value);
                                next.set("page", "1");
                                return next;
                            });
                        }}
                    >
                        <option value="-createdAt">Newest</option>
                        <option value="price">Price: Low → High</option>
                        <option value="-price">Price: High → Low</option>
                        <option value="name">Name A → Z</option>
                        <option value="-name">Name Z → A</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-outline-secondary w-100" type="submit">
                        Apply
                    </button>
                </div>
            </form>

            {/* List */}
            {loading ? (
                <div className="text-muted">Loading…</div>
            ) : items.length === 0 ? (
                <div className="text-muted">No products found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name / Brand</th>
                            <th>Category</th>
                            <th>Gender</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Flags</th>
                            <th style={{width:160}}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((p) => {
                            const img = p.thumbnailUrl || p.images?.[0]?.url;
                            return (
                                <tr key={p._id}>
                                    <td>
                                        {img ? (
                                            <img src={img} alt={p.name} style={{height:48, width:48, objectFit:"cover"}} className="rounded" />
                                        ) : (
                                            <div className="text-muted small">n/a</div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="fw-semibold">{p.name}</div>
                                        <div className="text-muted small">{p.brand}</div>
                                    </td>
                                    <td>{p.category}</td>
                                    <td>{p.gender || "-"}</td>
                                    <td>Rs. {Number(p.price || 0).toLocaleString()}</td>
                                    <td>{p.totalQuantity ?? 0}</td>
                                    <td className="small">
                                        {p.isActive ? <span className="badge text-bg-success me-1">Active</span> : <span className="badge text-bg-secondary me-1">Hidden</span>}
                                        {p.newArrival && <span className="badge text-bg-info">New</span>}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <Link to={`/admin/products/${p._id}`} className="btn btn-sm btn-outline-primary">
                                                Edit
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => onDelete(p._id)}
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                className="btn btn-sm btn-outline-secondary"
                                                to={`/product/${p._id || ""}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            Page {page} of {pages} • {total} total
                        </div>
                        <div className="btn-group">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Prev
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                disabled={page >= pages}
                                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
