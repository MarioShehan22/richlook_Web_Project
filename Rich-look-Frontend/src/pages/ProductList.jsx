import '../style/productsidebar.css';
import { useState, useEffect, useMemo } from 'react';
import axiosInstance from "../config/axiosConfig.js";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../store/CartContext.jsx";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import LoadingSkeleton, { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { useWishlist } from "../store/WishlistContext.jsx";

function ProductList() {
    // server-driven facets
    const [facetBrands, setFacetBrands] = useState([]);
    const [facetCategories, setFacetCategories] = useState([]);
    const [facetColors, setFacetColors] = useState([]);
    const [facetSizes, setFacetSizes] = useState([]);
    const [facetOccasions, setFacetOccasions] = useState([]);
    //const [selectedAudiences, setSelectedAudiences] = useState("");
    //const [facetGenders, setFacetGenders] = useState("");   // all genders available (from facets)
    const [selectedGender, setSelectedGender] = useState(""); // genders selected via URL / sidebar
    // filters
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState(null); // true | false | null
    const [newArrival, setNewArrival] = useState(false);
    const [sort, setSort] = useState('-createdAt');

    // data
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(12);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const {isInWishlist,addToWishlist } = useWishlist();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const g = searchParams.get('gender');
        setSelectedGender(g);
    }, [searchParams]);


    // Build query string based on filters
    const queryString = useMemo(() => {
        const q = new URLSearchParams();
        // backend expects minPrice / maxPrice
        if (priceMin) q.append('minPrice', priceMin);
        if (priceMax) q.append('maxPrice', priceMax);

        if (selectedColors.length) q.append('color', selectedColors.join(','));
        if (selectedSizes.length) q.append('size', selectedSizes.join(','));
        if (selectedBrands.length) q.append('brand', selectedBrands.join(','));
        if (selectedCategories.length) q.append('category', selectedCategories.join(','));
        if (selectedOccasions.length) q.append('occasion', selectedOccasions.join(','));

        if (newArrival) q.append('newArrival', 'true');

        // backend expects true/false strings for inStock, or omit if null
        if (selectedAvailability !== null) {
            q.append('inStock', selectedAvailability ? 'true' : 'false');
        }

        if (sort) q.append('sort', sort);
        q.append('page', String(page));
        q.append('gender', selectedGender);
        q.append('limit', String(limit));
        // onlyActive defaults to true on backend; keep explicit:
        q.append('onlyActive', 'true');

        return q.toString();
    }, [
        priceMin, priceMax,selectedGender,
        selectedColors, selectedSizes, selectedBrands, selectedCategories, selectedOccasions,
        selectedAvailability, newArrival, sort, page, limit
    ]);

    // Fetch facets once
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                //const genderParam = selectedGender;
                const qs = new URLSearchParams({
                    fields: 'brand,category,colors,sizes,occasions',
                    gender: selectedGender,          // REQUIRED
                    // includeUnisex: 'false',       // optional: keep strict if you changed backend to opt-in
                    onlyActive: 'true',
                });
                const { data } = await axiosInstance.get(`/products/facets?${qs.toString()}`, { signal: controller.signal });
                // Safely coerce to arrays
                //setSelectedAudiences(searchParams)
                setFacetBrands(Array.isArray(data?.brand) ? data.brand : []);
                setFacetCategories(Array.isArray(data?.category) ? data.category : []);
                setFacetColors(Array.isArray(data?.colors) ? data.colors : []);
                setFacetSizes(Array.isArray(data?.sizes) ? data.sizes : []);
                setFacetOccasions(Array.isArray(data?.occasions) ? data.occasions : []);
            } catch (e) {
                if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return;
                console.error('Error loading facets', e);
            }
        })();

        return () => controller.abort();
    }, [selectedGender]);

    // Fetch products whenever filters/sort/pagination change
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axiosInstance
            .get(`products?${queryString}`, { signal: controller.signal })
            .then(({ data }) => {
                setProducts(data.items || []);
                setPage(data.page || 1);
                setPages(data.pages || 1);
                setTotal(data.total || 0);
            })
            .catch((err) => {
                // Ignore aborts; log other errors
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
                console.error('Error fetching products', err);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [queryString]);

    const handleAddToCart = (product) => addToCart(product);
    const handleAddToWishlist = (product) => {
        addToWishlist(product);
        console.log('wishlist:', product);
    };
    const handleQuickView = (product) => {
        // TODO: open modal/drawer
        console.log('quick view:', product);
    };

    const toggleSelection = (value, selected, setter) => {
        setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const clearAll = () => {
        setPriceMin(''); setPriceMax('');
        setSelectedColors([]); setSelectedSizes([]);
        setSelectedBrands([]); setSelectedCategories([]);
        setSelectedOccasions([]);
        setSelectedAvailability(null);
        setNewArrival(false);
        setSort('-createdAt');
        setPage(1);
    };

    return (
        <div className="container my-4">
            <div className="row">
                <aside className="col-lg-3 mb-4">
                    <div className="sidebar">
                        <h5 className="mb-4 text-uppercase fw-bold text-secondary">Filters</h5>
                        <div className="accordion" id="filterAccordion">

                            {/* Price */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingPrice">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapsePrice" aria-expanded="true">
                                        Price Range
                                    </button>
                                </h2>
                                <div id="collapsePrice" className="accordion-collapse collapse show"
                                     aria-labelledby="headingPrice">
                                    <div className="accordion-body">
                                        <div className="d-flex gap-2">
                                            <input type="number" className="form-control" placeholder="Min"
                                                   value={priceMin} onChange={e => {
                                                setPriceMin(e.target.value);
                                                setPage(1);
                                            }}/>
                                            <input type="number" className="form-control" placeholder="Max"
                                                   value={priceMax} onChange={e => {
                                                setPriceMax(e.target.value);
                                                setPage(1);
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingCategory">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseCategory" aria-expanded="false">
                                        Category
                                    </button>
                                </h2>
                                <div id="collapseCategory" className="accordion-collapse collapse"
                                     aria-labelledby="headingCategory">
                                    <div className="accordion-body">
                                        {facetCategories?.map(cat => (
                                            <div className="form-check" key={cat}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`cat-${cat}`}
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => {
                                                        toggleSelection(cat, selectedCategories, setSelectedCategories);
                                                        setPage(1);
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor={`cat-${cat}`}>{cat}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Colors */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingColor">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseColor" aria-expanded="false">
                                        Color
                                    </button>
                                </h2>
                                <div id="collapseColor" className="accordion-collapse collapse"
                                     aria-labelledby="headingColor">
                                    <div className="accordion-body">
                                        {facetColors?.map(color => (
                                            <div className="form-check" key={color}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`color-${color}`}
                                                    checked={selectedColors.includes(color)}
                                                    onChange={() => {
                                                        toggleSelection(color, selectedColors, setSelectedColors);
                                                        setPage(1);
                                                    }}
                                                />
                                                <label className="form-check-label"
                                                       htmlFor={`color-${color}`}>{color}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingSize">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseSize" aria-expanded="false">
                                        Size
                                    </button>
                                </h2>
                                <div id="collapseSize" className="accordion-collapse collapse"
                                     aria-labelledby="headingSize">
                                    <div className="accordion-body">
                                        {facetSizes.map(size => (
                                            <div className="form-check" key={size}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`size-${size}`}
                                                    checked={selectedSizes.includes(size)}
                                                    onChange={() => {
                                                        toggleSelection(size, selectedSizes, setSelectedSizes);
                                                        setPage(1);
                                                    }}
                                                />
                                                <label className="form-check-label"
                                                       htmlFor={`size-${size}`}>{size}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Brands */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingBrand">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseBrand" aria-expanded="false">
                                        Brand
                                    </button>
                                </h2>
                                <div id="collapseBrand" className="accordion-collapse collapse"
                                     aria-labelledby="headingBrand">
                                    <div className="accordion-body">
                                        {facetCategories.length === 0 ? (
                                            <div className="text-muted small">No Brand</div>
                                        ) : (
                                            facetBrands.map(brand => (
                                                <div className="form-check" key={brand}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`brand-${brand}`}
                                                        checked={selectedBrands.includes(brand)}
                                                        onChange={() => {
                                                            toggleSelection(brand, selectedBrands, setSelectedBrands);
                                                            setPage(1);
                                                        }}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor={`brand-${brand}`}>{brand}</label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Occasions */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOccasion">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOccasion" aria-expanded="false">
                                        Occasion / Collection
                                    </button>
                                </h2>
                                <div id="collapseOccasion" className="accordion-collapse collapse"
                                     aria-labelledby="headingOccasion">
                                    <div className="accordion-body">
                                        {facetCategories.length === 0 ? (
                                            <div className="text-muted small">No categories</div>
                                        ) : (
                                            facetCategories.map(cat => (
                                                <div className="form-check" key={cat}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`cat-${cat.replace(/\W+/g, '-')}`}
                                                        checked={selectedCategories.includes(cat)}
                                                        onChange={() => {
                                                            toggleSelection(cat, selectedCategories, setSelectedCategories);
                                                            setPage(1);
                                                        }}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor={`cat-${cat.replace(/\W+/g, '-')}`}>{cat}</label>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* New Arrivals */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingNew">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseNew" aria-expanded="false">
                                        New Arrivals
                                    </button>
                                </h2>
                                <div id="collapseNew" className="accordion-collapse collapse"
                                     aria-labelledby="headingNew">
                                    <div className="accordion-body">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="new-arrivals"
                                                checked={newArrival}
                                                onChange={(e) => {
                                                    setNewArrival(e.target.checked);
                                                    setPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="new-arrivals">Show only new
                                                arrivals</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingStock">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseStock" aria-expanded="false">
                                        Availability
                                    </button>
                                </h2>
                                <div id="collapseStock" className="accordion-collapse collapse"
                                     aria-labelledby="headingStock">
                                    <div className="accordion-body">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="availability"
                                                id="availability-in"
                                                checked={selectedAvailability === true}
                                                onChange={() => {
                                                    setSelectedAvailability(true);
                                                    setPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="availability-in">In
                                                Stock</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="availability"
                                                id="availability-out"
                                                checked={selectedAvailability === false}
                                                onChange={() => {
                                                    setSelectedAvailability(false);
                                                    setPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="availability-out">Out of
                                                Stock</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="availability"
                                                id="availability-any"
                                                checked={selectedAvailability === null}
                                                onChange={() => {
                                                    setSelectedAvailability(null);
                                                    setPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="availability-any">Any</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-3">
                                <Button variant="secondary" className="w-50" onClick={clearAll}>Clear</Button>
                                {/* Optional: the filters auto-apply; keep an Apply to visually confirm */}
                                <Button className="w-50" onClick={() => setPage(1)}>Apply</Button>
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="mt-4">
                            <label className="form-label text-secondary">Sort by</label>
                            <select
                                className="form-select"
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="-createdAt">Newest</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="name">Name: A → Z</option>
                                <option value="-name">Name: Z → A</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="col-lg-9">
                    <header className="mb-4 d-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-0">Women&apos;s Collection</h1>
                        <div className="text-muted small">{total} item(s)</div>
                    </header>

                    {loading && <p>Loading products...</p>}
                    {!loading && products.length === 0 && <p>No products found.</p>}

                    <div className="row g-4">
                        {products.map((product) => {
                            const img = product.thumbnailUrl || (product.images && product.images[0]?.url) || '';
                            return (
                                <div className="col-12 col-sm-6 col-lg-4" key={product._id}>
                                    <ProductCard
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onAddToWishlist={handleAddToWishlist}
                                        onQuickView={handleQuickView}
                                        wished={isInWishlist(product._id || product.id)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted small">
                            Page {page} of {pages}
                        </div>
                        <div className="btn-group">
                            <Button
                                variant="outline-secondary"
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline-secondary"
                                disabled={page >= pages}
                                onClick={() => setPage(p => Math.min(pages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProductList;