import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            <aside className="bg-dark text-white p-3" style={{ width: 240 }}>
                <h5 className="mb-4">Admin</h5>
                <ul className="nav flex-column gap-1">
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" className="nav-link text-white">
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/products" className="nav-link text-white">
                            Products
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/products/new" className="nav-link text-white">
                            Add Product
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/orders" className="nav-link text-white">
                            Orders
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/users" className="nav-link text-white">
                            Users
                        </NavLink>
                    </li>
                </ul>
            </aside>

            <main className="flex-grow-1 bg-light">
                <div className="container py-4">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}
