import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/main.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axiosInstance from "../config/axiosConfig.js";
import { Link } from "react-router-dom";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import { useCart } from "../store/CartContext.jsx";
import Button from "../components/Button";
import { FaShoppingCart } from "react-icons/fa";
const fallback = "/images/placeholder-4x5.jpg";

const responsiveCarousel = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 5 },
    desktop:           { breakpoint: { max: 1200, min: 992  }, items: 4 },
    tablet:            { breakpoint: { max: 992,  min: 768  }, items: 3 },
    mobile:            { breakpoint: { max: 768,  min: 0    }, items: 2 },
};

const carouselSlides = [
    {
        img: "https://res.cloudinary.com/dywmv9onv/image/upload/v1756828902/products/nir4fhzkscymlfdmjsu5.jpg",
        title: "STRIKING LOOK FOR A",
        desc: "Stylish You",
        btns: [{ text: "Browse", className: "btn-light", href: "/products" }],
    },
    {
        img: "https://res.cloudinary.com/dywmv9onv/image/upload/v1756829046/products/pg6y1tesfpk12yqu3u3n.jpg",
        title: "NEW TERM DEALS",
        desc: "Exclusive Offers For Party Dress",
        btns: [{ text: "Shop Now", className: "btn-dark", href: "/products?sort=-arrivalDate" }],
    },
    {
        img: "https://res.cloudinary.com/dywmv9onv/image/upload/v1756829261/products/iyd8mgoihyuvvpbsirjb.jpg",
        title: "NEW TERM DEALS",
        desc: "Exclusive Offers For Men T-Shirts",
        btns: [{ text: "Shop Now", className: "btn-dark", href: "/products?sort=-arrivalDate" }],
    },
];

const categories = [
    { img: "https://cdn.zenegal.store/creatives/38/197/homepage-banner-1-featured-categories-womens-wear-17418362612527.png", label: "Womens Wear", href: "/products?gender=Women" },
    { img: "https://cdn.zenegal.store/creatives/38/198/homepage-banner-1-featured-categories-mens-wear-17418364107504.png",   label: "Mens Wear",   href: "/products?gender=Men" },
    { img: "https://cdn.zenegal.store/creatives/38/200/homepage-banner-1-featured-categories-kids-wear-1741836649464.png",    label: "Kids Wear",   href: "/products?gender=Kids" },
    { img: "https://cdn.zenegal.store/creatives/38/656/homepage-banner-1-featured-categories-gift-vouchers-17461645512849.png", label: "Gift Vouchers", href: "/gift-vouchers" },
];

const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString(undefined,{minimumFractionDigits:0})}`;


export function CategoryTile({ item, className = "" }) {
    if (!item) return null;
    return (
        <Link to={item.href} className={`category-box ${className}`}>
            <img src={item.img} alt={item.label} loading="lazy" />
            <div className="overlay">
                <h3 className="h3 mb-2">{item.label}</h3>
                <span className="btn btn-light btn-sm">Shop Now</span>
            </div>
        </Link>
    );
}
const promoBanner = (
    <section className="w-100 text-center bg-light py-4 mb-5">
        <h3 className="fw-bold mb-0 text-primary">ISLANDWIDE <br /> CASH ON DELIVERY AVAILABLE</h3>
    </section>
);

// Helper for react-multi-carousel
const carouselProps = (list) => ({
    responsive: responsiveCarousel,
    infinite: list.length > 5,
    autoPlay: list.length > 1,
    autoPlaySpeed: 4000,
    arrows: true,
});

function Home() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [womenNew, setWomenNew] = useState([]);
    const [menNew, setMenNew] = useState([]);
    const [womanPartyNew, setWomanPartyNew] = useState([]);
    const [womanOfficeWearNew, setWomanOfficeWearNew] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // auto-advance hero
    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // fetch new arrivals
    useEffect(() => {
        const controller = new AbortController();
        const mkQuery = (params) =>
            `products?${new URLSearchParams({
                newArrival: "true",
                inStock: "true",
                sort: "-arrivalDate",
                page: "1",
                limit: "12",
                onlyActive: "true",
                ...params,
            }).toString()}`;

        (async () => {
            try {
                setLoading(true);
                const [wRes, mRes] = await Promise.all([
                    axiosInstance.get(mkQuery({ gender: "Women"}), { signal: controller.signal }),
                    axiosInstance.get(mkQuery({ gender: "Men"}), { signal: controller.signal }),
                ]);
                setWomenNew(wRes.data?.items || []);
                setMenNew(mRes.data?.items || []);
            } catch (e) {
                if (e.name !== "CanceledError" && e.code !== "ERR_CANCELED") {
                    console.error("Home fetch error:", e);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadPartyProducts = async () => {
            try {
                const { data } = await axiosInstance.get("/products", {
                    params: {
                        occasions: "Party",     // array field; server matches with $in
                        onlyActive: "true",
                        inStock: "true",
                        limit: 12,
                        sort: "-arrivalDate",
                    },
                    signal: controller.signal,
                });

                if (isMounted) {
                    setWomanPartyNew(data?.items ?? []);
                    console.log(data?.items);
                }
            } catch (err) {
                // ignore abort errors; log others
                if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
                    console.error("Failed to load Party products:", err);
                }
            }
        };

        loadPartyProducts();

        return () => {
            isMounted = false;
            controller.abort(); // cancel request on unmount
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadOfficeProducts = async () => {
            try {
                const { data } = await axiosInstance.get("/products", {
                    params: {
                        occasions: "Office Wear",     // array field; server matches with $in
                        onlyActive: "true",
                        inStock: "true",
                        limit: 12,
                        sort: "-arrivalDate",
                    },
                    signal: controller.signal,
                });

                if (isMounted) {
                    setWomanOfficeWearNew(data?.items ?? []);
                    console.log(data?.items);
                }
            } catch (err) {
                // ignore abort errors; log others
                if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
                    console.error("Failed to load Party products:", err);
                }
            }
        };

        loadOfficeProducts();

        return () => {
            isMounted = false;
            controller.abort(); // cancel request on unmount
        };
    }, []);

    return (
        <>
            {/* HERO */}
            <div id="heroCarousel" className="carousel slide mb-4 position-relative" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {carouselSlides.map((slide, idx) => (
                        <div key={idx} className={`carousel-item${idx === carouselIndex ? " active" : ""}`}>
                            <img
                                src={slide.img}
                                className="d-block w-100"
                                alt={`Banner ${idx + 1}`}
                                style={{height: "600px", objectFit: "cover"}}
                            />
                            <div className="carousel-caption d-none d-md-block text-start">
                                <h2 className="display-5 fw-bold">{slide.title}</h2>
                                <p className="fs-3">{slide.desc}</p>
                                {slide.btns.map((btn, bIdx) => (
                                    <Link key={bIdx} to={btn.href} className={`btn ${btn.className} btn-sm me-2`}>
                                        {btn.text}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide="prev"
                    onClick={() => setCarouselIndex((carouselIndex - 1 + carouselSlides.length) % carouselSlides.length)}
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"/>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide="next"
                    onClick={() => setCarouselIndex((carouselIndex + 1) % carouselSlides.length)}
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"/>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* CATEGORY GRID */}
            <section className="container mb-5">
                <div className="cat-grid">
                    <CategoryTile item={categories[0]} className="cat-women"/>
                    <CategoryTile item={categories[1]} className="cat-men"/>
                    <div className="cat-subgrid">
                        <CategoryTile item={categories[2]}/>
                        <CategoryTile item={categories[3]}/>
                    </div>
                </div>
            </section>

            {promoBanner}

            {/* NEW ARRIVALS: WOMEN */}
            <section className="container mb-5 new-arrivals">
                <div className="na-header d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="h4 mb-0">New Arrivals in Women</h2>
                        <small className="text-muted">Fresh drops, updated weekly</small>
                    </div>
                    <Link
                        to="/products?gender=Women&newArrival=true&sort=-arrivalDate"
                        className="btn btn-link na-viewall"
                    >
                        View all
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4}/>
                ) : womenNew.length === 0 ? (
                    <div className="text-muted text-center py-4">No new arrivals found.</div>
                ) : (
                    <Carousel {...carouselProps(womenNew)} itemClass="px-2">
                        {womenNew.map((product) => {
                            const img = product.thumbnailUrl || product.images?.[0]?.url || "";
                            const to = product.slug ? `/product/${product.slug}` : `/product/id/${product._id}`;
                            const hasDiscount =
                                Number(product.compareAtPrice) > Number(product.price);
                            const discountPct = hasDiscount
                                ? Math.round((1 - product.price / product.compareAtPrice) * 100)
                                : 0;
                            const fmt = (n) =>
                                `Rs. ${Number(n || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                })}`;

                            return (
                                <div key={product._id} className="na-card">
                                    <div className="na-thumb">
                                        <Link to={to} className="product-link d-block h-100">
                                            {img && (
                                                <img
                                                    src={img || fallback}
                                                    onError={(e) => {
                                                        e.currentTarget.src = fallback;
                                                    }}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                            )}
                                        </Link>

                                        {/* Badges */}
                                        <span className="na-badge na-badge-new">New</span>
                                        {hasDiscount && (
                                            <span className="na-badge na-badge-sale">-{discountPct}%</span>
                                        )}
                                    </div>

                                    <div className="na-body">
                                        <div className="na-brand text-muted small mb-1">{product.brand}</div>

                                        <Link to={to} className="na-title d-block text-decoration-none">
                                            {product.name}
                                        </Link>

                                        <div className="na-price mt-1">
                                            <span className="na-price-now">{fmt(product.price)}</span>
                                            {hasDiscount && (
                                                <span className="na-price-old">{fmt(product.compareAtPrice)}</span>
                                            )}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 na-cta mt-3"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                        >
                                            <FaShoppingCart className="me-2"/>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                )}
            </section>


            {/* NEW ARRIVALS: MEN */}

            <section className="container mb-5 new-arrivals">
                <div className="na-header d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="h4 mb-0">New Arrivals in Women</h2>
                        <small className="text-muted">Fresh drops, updated weekly</small>
                    </div>
                    <Link
                        to="/products?gender=Women&newArrival=true&sort=-arrivalDate"
                        className="btn btn-link na-viewall"
                    >
                        View all
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4}/>
                ) : menNew.length === 0 ? (
                    <div className="text-muted text-center py-4">No new arrivals found.</div>
                ) : (
                    <Carousel {...carouselProps(menNew)} itemClass="px-2">
                        {menNew.map((product) => {
                            const img = product.thumbnailUrl || product.images?.[0]?.url || "";
                            const to = product.slug ? `/product/${product.slug}` : `/product/id/${product._id}`;
                            const hasDiscount =
                                Number(product.compareAtPrice) > Number(product.price);
                            const discountPct = hasDiscount
                                ? Math.round((1 - product.price / product.compareAtPrice) * 100)
                                : 0;
                            const fmt = (n) =>
                                `Rs. ${Number(n || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                })}`;

                            return (
                                <div key={product._id} className="na-card">
                                    <div className="na-thumb">
                                        <Link to={to} className="product-link d-block h-100">
                                            {img && (
                                                <img
                                                    src={img || fallback}
                                                    onError={(e) => {
                                                        e.currentTarget.src = fallback;
                                                    }}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                            )}
                                        </Link>

                                        {/* Badges */}
                                        <span className="na-badge na-badge-new">New</span>
                                        {hasDiscount && (
                                            <span className="na-badge na-badge-sale">-{discountPct}%</span>
                                        )}
                                    </div>

                                    <div className="na-body">
                                        <div className="na-brand text-muted small mb-1">{product.brand}</div>

                                        <Link to={to} className="na-title d-block text-decoration-none">
                                            {product.name}
                                        </Link>

                                        <div className="na-price mt-1">
                                            <span className="na-price-now">{fmt(product.price)}</span>
                                            {hasDiscount && (
                                                <span className="na-price-old">{fmt(product.compareAtPrice)}</span>
                                            )}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 na-cta mt-3"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                        >
                                            <FaShoppingCart className="me-2"/>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                )}
            </section>

            <section className="container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h4">New Arrivals in Women Office Wear</h2>
                    <Link to="/products?gender=women&newArrival=true&sort=-arrivalDate" className="btn btn-link">
                        View all
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4}/>
                ) : menNew.length === 0 ? (
                    <div className="text-muted text-center py-4">No new arrivals found.</div>
                ) : (
                    <Carousel {...carouselProps(menNew)}>
                        {womanOfficeWearNew.map((product) => {
                            const img = product.thumbnailUrl || product.images?.[0]?.url || "";
                            const to = product.slug ? `/product/${product.slug}` : `/product/id/${product._id}`;
                            const hasDiscount =
                                Number(product.compareAtPrice) > Number(product.price);
                            const discountPct = hasDiscount
                                ? Math.round((1 - product.price / product.compareAtPrice) * 100)
                                : 0;
                            const fmt = (n) =>
                                `Rs. ${Number(n || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                })}`;

                            return (
                                <div key={product._id} className="na-card">
                                    <div className="na-thumb">
                                        <Link to={to} className="product-link d-block h-100">
                                            {img && (
                                                <img
                                                    src={img || fallback}
                                                    onError={(e) => {
                                                        e.currentTarget.src = fallback;
                                                    }}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                            )}
                                        </Link>

                                        {/* Badges */}
                                        <span className="na-badge na-badge-new">New</span>
                                        {hasDiscount && (
                                            <span className="na-badge na-badge-sale">-{discountPct}%</span>
                                        )}
                                    </div>

                                    <div className="na-body">
                                        <div className="na-brand text-muted small mb-1">{product.brand}</div>

                                        <Link to={to} className="na-title d-block text-decoration-none">
                                            {product.name}
                                        </Link>

                                        <div className="na-price mt-1">
                                            <span className="na-price-now">{fmt(product.price)}</span>
                                            {hasDiscount && (
                                                <span className="na-price-old">{fmt(product.compareAtPrice)}</span>
                                            )}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 na-cta mt-3"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                        >
                                            <FaShoppingCart className="me-2"/>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                )}
            </section>
            <section className="container mb-5 new-arrivals">
                <div className="na-header d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="h4 mb-0">New Arrivals in Party Dress</h2>
                        <small className="text-muted">Fresh drops, updated weekly</small>
                    </div>
                    <Link
                        to="/products?gender=Women&newArrival=true&sort=-arrivalDate"
                        className="btn btn-link na-viewall"
                    >
                        View all
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={4}/>
                ) : menNew.length === 0 ? (
                    <div className="text-muted text-center py-4">No new arrivals found.</div>
                ) : (
                    <Carousel {...carouselProps(menNew)} itemClass="px-2">
                        {womanPartyNew.map((product) => {
                            const img = product.thumbnailUrl || product.images?.[0]?.url || "";
                            const to = product.slug ? `/product/${product.slug}` : `/product/id/${product._id}`;
                            const hasDiscount =
                                Number(product.compareAtPrice) > Number(product.price);
                            const discountPct = hasDiscount
                                ? Math.round((1 - product.price / product.compareAtPrice) * 100)
                                : 0;
                            const fmt = (n) =>
                                `Rs. ${Number(n || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                })}`;

                            return (
                                <div key={product._id} className="na-card">
                                    <div className="na-thumb">
                                        <Link to={to} className="product-link d-block h-100">
                                            {img && (
                                                <img
                                                    src={img || fallback}
                                                    onError={(e) => {
                                                        e.currentTarget.src = fallback;
                                                    }}
                                                    alt={product.name}
                                                    loading="lazy"
                                                />
                                            )}
                                        </Link>

                                        {/* Badges */}
                                        <span className="na-badge na-badge-new">New</span>
                                        {hasDiscount && (
                                            <span className="na-badge na-badge-sale">-{discountPct}%</span>
                                        )}
                                    </div>

                                    <div className="na-body">
                                        <div className="na-brand text-muted small mb-1">{product.brand}</div>

                                        <Link to={to} className="na-title d-block text-decoration-none">
                                            {product.name}
                                        </Link>

                                        <div className="na-price mt-1">
                                            <span className="na-price-now">{fmt(product.price)}</span>
                                            {hasDiscount && (
                                                <span className="na-price-old">{fmt(product.compareAtPrice)}</span>
                                            )}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 na-cta mt-3"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                        >
                                            <FaShoppingCart className="me-2"/>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Carousel>
                )}
            </section>
        </>
    );
}

export default Home;