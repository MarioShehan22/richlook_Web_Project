import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { FaHeart, FaPhone, FaShoppingCart, FaUser } from "react-icons/fa";
import { useWishlist } from "../store/WishlistContext.jsx";
import { useCart } from "../store/CartContext.jsx";

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
        <li className="rl-nav-item">
            <Link className="rl-nav-link" to={linkFor(gender)} role="button" data-bs-toggle="dropdown">
                <span className="rl-nav-label">{label}</span>
                <span className="rl-nav-underline" />
            </Link>
            {cats.length > 0 && (
                <ul className="rl-dropdown">
                    <li className="rl-dropdown-header">{label}</li>
                    {cats.slice(0, 8).map((c) => (
                        <li key={c}>
                            <Link className="rl-dropdown-item" to={linkFor(gender, c)}>
                                <span className="rl-item-arrow">→</span> {c}
                            </Link>
                        </li>
                    ))}
                    <li className="rl-dropdown-divider" />
                    <li>
                        <Link className="rl-dropdown-item rl-view-all" to={linkFor(gender)}>
                            View all {label.toLowerCase()} ›
                        </Link>
                    </li>
                </ul>
            )}
        </li>
    );

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [term, setTerm] = useState("");

    useEffect(() => {
        setTerm(searchParams.get("q") || "");
    }, [searchParams]);

    const onSubmit = (e) => {
        e.preventDefault();
        const next = new URLSearchParams();
        if (term.trim()) next.set("q", term.trim());
        const g = searchParams.get("gender");
        if (g) next.set("gender", g);
        navigate(`/products?${next.toString()}`);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap');

                :root {
                    --rl-cream: #faf8f5;
                    --rl-dark: #1a1614;
                    --rl-gold: #c9a96e;
                    --rl-muted: #7a6e65;
                    --rl-border: #e8e2da;
                    --rl-hover-bg: #f5f0e8;
                }

                .rl-topbar {
                    background: var(--rl-dark);
                    color: #d4c4a8;
                    font-family: 'Jost', sans-serif;
                    font-size: 11px;
                    font-weight: 300;
                    letter-spacing: 0.12em;
                    text-align: center;
                    padding: 7px 0;
                    text-transform: uppercase;
                }

                .rl-navbar {
                    background: var(--rl-cream);
                    border-bottom: 1px solid var(--rl-border);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 2px 24px rgba(26,22,20,0.06);
                }

                .rl-navbar .container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    height: 70px;
                    gap: 1rem;
                }

                /* Logo */
                .rl-brand img {
                    height: 38px;
                    transition: opacity 0.2s;
                }
                .rl-brand:hover img { opacity: 0.75; }

                /* Nav list */
                .rl-nav-list {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .rl-nav-item {
                    position: relative;
                }

                .rl-nav-link {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px 16px;
                    text-decoration: none;
                    position: relative;
                    cursor: pointer;
                }

                .rl-nav-label {
                    font-family: 'Jost', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: var(--rl-dark);
                    transition: color 0.25s;
                }

                .rl-nav-underline {
                    display: block;
                    height: 1px;
                    width: 0;
                    background: var(--rl-gold);
                    transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
                    margin-top: 3px;
                }

                .rl-nav-item:hover .rl-nav-underline,
                .rl-nav-item:focus-within .rl-nav-underline {
                    width: 100%;
                }

                .rl-nav-item:hover .rl-nav-label {
                    color: var(--rl-gold);
                }

                /* Dropdown */
                .rl-dropdown {
                    display: none;
                    position: absolute;
                    top: calc(100% + 1px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: #fff;
                    border: 1px solid var(--rl-border);
                    border-top: 2px solid var(--rl-gold);
                    min-width: 210px;
                    list-style: none;
                    margin: 0;
                    padding: 8px 0 12px;
                    box-shadow: 0 12px 40px rgba(26,22,20,0.12);
                    animation: rlDropIn 0.22s ease forwards;
                    z-index: 999;
                }

                @keyframes rlDropIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .rl-nav-item:hover .rl-dropdown,
                .rl-nav-item:focus-within .rl-dropdown {
                    display: block;
                }

                .rl-dropdown-header {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 17px;
                    font-weight: 600;
                    color: var(--rl-dark);
                    padding: 8px 20px 6px;
                    letter-spacing: 0.04em;
                    border-bottom: 1px solid var(--rl-border);
                    margin-bottom: 4px;
                }

                .rl-dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 20px;
                    font-family: 'Jost', sans-serif;
                    font-size: 12.5px;
                    font-weight: 400;
                    letter-spacing: 0.06em;
                    color: var(--rl-muted);
                    text-decoration: none;
                    transition: color 0.2s, background 0.2s, padding-left 0.2s;
                }

                .rl-item-arrow {
                    font-size: 11px;
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: opacity 0.2s, transform 0.2s;
                    color: var(--rl-gold);
                }

                .rl-dropdown-item:hover {
                    color: var(--rl-dark);
                    background: var(--rl-hover-bg);
                    padding-left: 24px;
                }

                .rl-dropdown-item:hover .rl-item-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                .rl-dropdown-divider {
                    height: 1px;
                    background: var(--rl-border);
                    margin: 8px 0;
                }

                .rl-view-all {
                    font-weight: 500;
                    color: var(--rl-gold) !important;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    font-size: 11px !important;
                }

                .rl-view-all:hover {
                    color: var(--rl-dark) !important;
                    background: var(--rl-hover-bg);
                }

                /* Icons */
                .rl-icons {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .rl-icon-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    color: var(--rl-dark);
                    text-decoration: none;
                    font-size: 14px;
                    position: relative;
                    transition: background 0.2s, color 0.2s, transform 0.2s;
                }

                .rl-icon-btn:hover {
                    background: var(--rl-hover-bg);
                    color: var(--rl-gold);
                    transform: translateY(-1px);
                }

                .rl-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    width: 16px;
                    height: 16px;
                    background: var(--rl-dark);
                    color: var(--rl-cream);
                    border-radius: 50%;
                    font-family: 'Jost', sans-serif;
                    font-size: 9px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1.5px solid var(--rl-cream);
                }

                .rl-divider {
                    width: 1px;
                    height: 18px;
                    background: var(--rl-border);
                    margin: 0 4px;
                }

                /* Gift Vouchers link */
                .rl-nav-gift .rl-nav-label {
                    color: var(--rl-gold);
                }

                /* Toggler */
                .rl-toggler {
                    background: none;
                    border: 1px solid var(--rl-border);
                    border-radius: 4px;
                    padding: 6px 10px;
                    cursor: pointer;
                    display: none;
                    color: var(--rl-dark);
                    font-size: 18px;
                    line-height: 1;
                    transition: background 0.2s;
                }

                .rl-toggler:hover { background: var(--rl-hover-bg); }

                /* Desktop: ensure collapse is always visible and laid out correctly */
                @media (min-width: 992px) {
                    .rl-collapse {
                        display: flex !important;
                        align-items: center;
                        justify-content: space-between;
                        flex: 1;
                    }
                }

                @media (max-width: 991px) {
                    .rl-toggler { display: flex; align-items: center; }
                    .rl-collapse {
                        position: absolute;
                        top: 70px;
                        left: 0; right: 0;
                        background: var(--rl-cream);
                        border-top: 1px solid var(--rl-border);
                        padding: 1rem 1.5rem 1.5rem;
                        box-shadow: 0 12px 30px rgba(26,22,20,0.1);
                        z-index: 999;
                    }
                    .rl-nav-list { flex-direction: column; align-items: flex-start; gap: 0; }
                    .rl-nav-link { padding: 10px 0; width: 100%; }
                    .rl-dropdown { position: static; transform: none; box-shadow: none; border: none; border-left: 2px solid var(--rl-gold); border-top: none; margin-left: 12px; animation: none; }
                    .rl-nav-item:hover .rl-nav-underline { width: 40px; }
                    .rl-icons { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--rl-border); }
                }
            `}</style>

            {/* Top announcement bar */}
            <div className="rl-topbar">
                Free shipping on orders over Rs. 5,000 &nbsp;·&nbsp; New arrivals every week
            </div>

            <nav className="rl-navbar">
                <div className="container">
                    {/* Logo */}
                    <Link className="rl-brand" to="/">
                        <img src="https://www.richlook.lk/images/logo.png" alt="Rich Look Logo" />
                    </Link>

                    {/* Mobile toggler */}
                    <button
                        className="rl-toggler navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        ☰
                    </button>

                    {/* Nav + Icons */}
                    <div className="collapse navbar-collapse rl-collapse" id="navbarNav">
                        <ul className="rl-nav-list">
                            <Drop label="Womens" gender="Women" cats={womenCats} />
                            <Drop label="Mens"   gender="Men"   cats={menCats} />
                            <Drop label="Kids"   gender="Kids"  cats={kidsCats} />
                            <li className="rl-nav-item rl-nav-gift">
                                <Link className="rl-nav-link" to="/gift-vouchers">
                                    <span className="rl-nav-label">Gift Vouchers</span>
                                    <span className="rl-nav-underline" />
                                </Link>
                            </li>
                        </ul>

                        {/* Icons */}
                        <div className="rl-icons">
                            <a href="tel:+94XXXXXXXXX" className="rl-icon-btn" aria-label="Call us" title="Call us">
                                <FaPhone />
                            </a>
                            <div className="rl-divider" />
                            <Link to="/login" className="rl-icon-btn" aria-label="Account" title="My Account">
                                <FaUser />
                            </Link>
                            <Link to="/cart" className="rl-icon-btn" aria-label="Cart" title="Shopping Cart">
                                <FaShoppingCart />
                                {cartItems.length > 0 && (
                                    <span className="rl-badge">{cartItems.length}</span>
                                )}
                            </Link>
                            <Link to="/wishlist" className="rl-icon-btn" aria-label="Wishlist" title="Wishlist">
                                <FaHeart />
                                {wishlistItems.length > 0 && (
                                    <span className="rl-badge">{wishlistItems.length}</span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;