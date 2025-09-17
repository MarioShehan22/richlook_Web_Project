import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { FaHeart, FaPhone, FaShoppingCart, FaUser } from "react-icons/fa";
import {useWishlist} from "../store/WishlistContext.jsx";
import {useCart} from "../store/CartContext.jsx";

function useGenderCategories(gender) {
    const [cats, setCats] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const { data } = await axiosInstance.get(
                    `/products/facets?fields=category&gender=${encodeURIComponent(gender)}`,
                    { signal: controller.signal }
                );
                setCats(Array.isArray(data?.category) ? data.category : []);
            } catch (e) {
                if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
                    console.error(`facets (${gender})`, e);
                }
            }
        })();
        return () => controller.abort();
    }, [gender]);
    return cats;
}

const Navbar = () => {
    const womenCats = useGenderCategories("Women");
    const menCats   = useGenderCategories("Men");
    const kidsCats  = useGenderCategories("Kids");
    const { wishlistItems } = useWishlist();
    const { cartItems } = useCart();

    const linkFor = (gender, category) => {
        const q = new URLSearchParams({ gender });
        if (category) q.append("category", category);
        return `/products?${q.toString()}`;
    };

    const Drop = ({ label, gender, cats }) => (
        <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to={linkFor(gender)} role="button" data-bs-toggle="dropdown">
                {label}
            </Link>
            {cats.length > 0 && (
                <ul className="dropdown-menu">
                    {cats.slice(0, 8).map((c) => (
                        <li key={c}>
                            <Link className="dropdown-item" to={linkFor(gender, c)}>
                                {c}
                            </Link>
                        </li>
                    ))}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <Link className="dropdown-item fw-semibold" to={linkFor(gender)}>
                            View all {label.toLowerCase()}
                        </Link>
                    </li>
                </ul>
            )}
        </li>
    );

    // --- Search state ---
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [term, setTerm] = useState("");

    // Keep input in sync with URL (?q=...)
    useEffect(() => {
        setTerm(searchParams.get("q") || "");
    }, [searchParams]);

    const onSubmit = (e) => {
        e.preventDefault();
        const next = new URLSearchParams();
        if (term.trim()) next.set("q", term.trim());
        // Keep any existing gender if user is already browsing a department
        const g = searchParams.get("gender");
        if (g) next.set("gender", g);
        navigate(`/products?${next.toString()}`);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="https://www.richlook.lk/images/logo.png" alt="Rich Look Logo" height="40" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <Drop label="Womens" gender="Women" cats={womenCats} />
                        <Drop label="Mens"   gender="Men"   cats={menCats} />
                        <Drop label="Kids"   gender="Kids"  cats={kidsCats} />
                        <li className="nav-item">
                            <Link className="nav-link" to="/gift-vouchers">Gift Vouchers</Link>
                        </li>
                    </ul>

                    {/* Search (keeps the existing visual style: Bootstrap form, compact) */}
                    {/*<form className="d-flex me-lg-3 my-2 my-lg-0" onSubmit={onSubmit} role="search">*/}
                    {/*    <input*/}
                    {/*        className="form-control me-2"*/}
                    {/*        type="search"*/}
                    {/*        placeholder="Search products…"*/}
                    {/*        aria-label="Search"*/}
                    {/*        value={term}*/}
                    {/*        onChange={(e) => setTerm(e.target.value)}*/}
                    {/*    />*/}
                    {/*    <button className="btn btn-outline-secondary" type="submit">Search</button>*/}
                    {/*</form>*/}

                    <div className="d-flex align-items-center gap-3 nav-icons">
                        <a href="tel:+94XXXXXXXXX" className="text-dark" aria-label="Call us"><FaPhone /></a>
                        <Link to="/login" className="text-dark" aria-label="Account"><FaUser /></Link>
                        <Link to="/cart" className="text-dark position-relative" aria-label="Wishlist">
                            <FaShoppingCart />
                            {cartItems.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                  {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/wishlist" className="text-dark position-relative">
                            <FaHeart />
                            {wishlistItems.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                  {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;