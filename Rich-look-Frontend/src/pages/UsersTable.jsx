import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import dayjs from 'dayjs';

const roleBadge = (role) => {
    const map = {
        admin: 'bg-danger',
        manager: 'bg-primary',
        staff: 'bg-info text-dark',
        user: 'bg-secondary',
    };
    return <span className={`badge ${map[role] || 'bg-secondary'}`}>{role || 'user'}</span>;
};

export default function UsersTable() {
    const [rows, setRows] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    // UI state
    const [q, setQ] = useState('');
    const [sort, setSort] = useState({ key: 'createdAt', dir: 'desc' }); // asc|desc
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('users/find-all');
                if (!alive) return;
                setRows(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!alive) return;
                setMsg(e?.response?.data?.message || 'Failed to load users');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    // filter + sort
    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const base = needle
            ? rows.filter(u =>
                (u.name || '').toLowerCase().includes(needle) ||
                (u.email || '').toLowerCase().includes(needle)
            )
            : rows.slice();

        base.sort((a, b) => {
            const dir = sort.dir === 'asc' ? 1 : -1;
            const av = a[sort.key] ?? '';
            const bv = b[sort.key] ?? '';
            if (sort.key === 'createdAt') {
                return (new Date(av) - new Date(bv)) * dir;
            }
            return String(av).localeCompare(String(bv)) * dir;
        });
        return base;
    }, [rows, q, sort]);

    // pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pg = Math.min(page, totalPages);
    const start = (pg - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);

    const setSortKey = (key) => {
        setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
    };

    if (loading) return <div className="container py-5">Loading…</div>;
    if (msg) return <div className="container py-5 text-danger">{msg}</div>;

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                <h1 className="h4 mb-2">Users</h1>
                <div className="d-flex gap-2">
                    <input
                        className="form-control"
                        style={{ minWidth: 260 }}
                        placeholder="Search by name or email…"
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    />
                    <select
                        className="form-select"
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        aria-label="Rows per page"
                    >
                        {[5,10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
                    </select>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: 36 }}>#</th>
                            <th role="button" onClick={() => setSortKey('name')}>
                                Name {sort.key === 'name' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th role="button" onClick={() => setSortKey('email')}>
                                Email {sort.key === 'email' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th style={{ width: 120 }} role="button" onClick={() => setSortKey('role')}>
                                Role {sort.key === 'role' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                            </th>
                            <th style={{ width: 190 }} role="button" onClick={() => setSortKey('createdAt')}>
                                Registered {sort.key === 'createdAt' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {pageRows.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4 text-muted">No users found.</td></tr>
                        ) : pageRows.map((u, idx) => (
                            <tr key={u._id}>
                                <td>{start + idx + 1}</td>
                                <td className="fw-semibold">
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="rounded-circle bg-success-subtle d-inline-flex align-items-center justify-content-center"
                                            style={{ width: 32, height: 32 }}
                                            title={u.name || u.email}
                                        >
                        <span className="small fw-bold">
                          {(u.name || u.email || '?').slice(0,1).toUpperCase()}
                        </span>
                                        </div>
                                        <span>{u.name || '—'}</span>
                                    </div>
                                </td>
                                <td className="text-muted">{u.email}</td>
                                <td>{roleBadge(u.role)}</td>
                                <td className="text-muted">
                                    {u.createdAt ? dayjs(u.createdAt).format('MMM D, YYYY') : '—'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* footer / pagination */}
                <div className="d-flex flex-wrap align-items-center justify-content-between px-3 py-2">
                    <div className="small text-muted">
                        Showing <strong>{pageRows.length}</strong> of <strong>{filtered.length}</strong> users
                    </div>
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${pg <= 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(1)}>&laquo;</button>
                            </li>
                            <li className={`page-item ${pg <= 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">Page {pg} / {totalPages}</span>
                            </li>
                            <li className={`page-item ${pg >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                            </li>
                            <li className={`page-item ${pg >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPage(totalPages)}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}
