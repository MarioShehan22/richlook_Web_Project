import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CartPage from "./pages/CartPage.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import Signup from "./pages/Signup.jsx";
import Categories from "./pages/Categories.jsx";
import ComponentDemo from "./pages/ComponentDemo.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductEditor from "./pages/ProductEditor.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import UsersTable from "./pages/UsersTable.jsx";
import GiftVouchers from "./pages/GiftVouchers.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/id/:id" element={<ProductDetails />} />
                    <Route path="product/:slug" element={<ProductDetails />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="/gift-vouchers" element={<GiftVouchers />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<ProductsPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/new" element={<ProductEditor />} />
                    <Route path="products/:id" element={<ProductEditor />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UsersTable />} />

                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/demo" element={<ComponentDemo />} />
            </Routes>
        </Router>
    );
}

export default App;
