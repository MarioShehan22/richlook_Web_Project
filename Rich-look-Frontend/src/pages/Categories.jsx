import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig.js';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Alert from '../components/Alert';
import { FaSearch, FaFilter, FaTh, FaList } from 'react-icons/fa';
import '../style/categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/categories');
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on search term and selected filter
    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = selectedFilter === 'all' || 
                            category.type === selectedFilter ||
                            category.gender === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });

    // Get unique filter options
    const filterOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'men', label: "Men's Collection" },
        { value: 'women', label: "Women's Collection" },
        { value: 'accessories', label: 'Accessories' },
        { value: 'footwear', label: 'Footwear' },
        { value: 'bags', label: 'Bags & Wallets' }
    ];

    const CategoryCard = ({ category }) => (
        <div className="rl-card rl-card-body rl-p-6 rl-h-full category-card-hover rl-cursor-pointer group category-card-focus">
            <div className="rl-relative rl-overflow-hidden rl-rounded-lg rl-mb-4 category-image-overlay">
                <img
                    src={category.image || 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Category'}
                    alt={category.name}
                    className="rl-w-full rl-h-48 rl-object-cover rl-transition-transform group-hover:rl-scale-105"
                />
                {category.isNew && (
                    <div className="rl-absolute rl-top-3 rl-right-3 rl-bg-red-500 rl-text-white rl-px-2 rl-py-1 rl-rounded-full rl-text-xs rl-font-semibold category-badge">
                        New
                    </div>
                )}
                {category.discount && (
                    <div className="rl-absolute rl-top-3 rl-left-3 rl-bg-green-500 rl-text-white rl-px-2 rl-py-1 rl-rounded-full rl-text-xs rl-font-semibold category-badge">
                        {category.discount}% OFF
                    </div>
                )}
            </div>
            
            <h3 className="rl-text-xl rl-font-semibold rl-mb-2 rl-text-neutral-900 group-hover:rl-text-primary-600 rl-transition-colors">
                {category.name}
            </h3>
            
            {category.description && (
                <p className="rl-text-neutral-600 rl-text-sm rl-mb-4 rl-line-clamp-2">
                    {category.description}
                </p>
            )}
            
            <div className="rl-flex rl-justify-between rl-items-center rl-mt-auto">
                <div className="rl-text-sm rl-text-neutral-500">
                    {category.productCount || 0} products
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    className="rl-opacity-0 group-hover:rl-opacity-100 rl-transition-opacity"
                >
                    View Products
                </Button>
            </div>
        </div>
    );

    const CategoryListItem = ({ category }) => (
        <div className="rl-card rl-card-body rl-p-6 rl-transition-all hover:rl-shadow-md rl-cursor-pointer group">
            <div className="rl-flex rl-items-center rl-gap-6">
                <div className="rl-relative rl-flex-shrink-0">
                    <img
                        src={category.image || 'https://via.placeholder.com/120x80/f3f4f6/6b7280?text=Category'}
                        alt={category.name}
                        className="rl-w-30 rl-h-20 rl-object-cover rl-rounded-lg rl-transition-transform group-hover:rl-scale-105"
                    />
                    {category.isNew && (
                        <div className="rl-absolute rl-top-1 rl-right-1 rl-bg-red-500 rl-text-white rl-px-1 rl-py-0.5 rl-rounded-full rl-text-xs rl-font-semibold">
                            New
                        </div>
                    )}
                </div>
                
                <div className="rl-flex-1">
                    <h3 className="rl-text-lg rl-font-semibold rl-mb-1 rl-text-neutral-900 group-hover:rl-text-primary-600 rl-transition-colors">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="rl-text-neutral-600 rl-text-sm rl-mb-2">
                            {category.description}
                        </p>
                    )}
                    <div className="rl-flex rl-items-center rl-gap-4 rl-text-sm rl-text-neutral-500">
                        <span>{category.productCount || 0} products</span>
                        {category.type && (
                            <span className="rl-bg-neutral-100 rl-px-2 rl-py-1 rl-rounded-full rl-text-xs">
                                {category.type}
                            </span>
                        )}
                    </div>
                </div>
                
                <Button
                    variant="primary"
                    size="sm"
                    className="rl-opacity-0 group-hover:rl-opacity-100 rl-transition-opacity"
                >
                    View Products
                </Button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="rl-container rl-py-8">
                <div className="rl-mb-8">
                    <LoadingSkeleton type="title" />
                    <LoadingSkeleton type="text" lines={1} />
                </div>
                <div className="rl-grid rl-grid-cols-1 md:rl-grid-cols-2 lg:rl-grid-cols-3 rl-gap-6">
                    {[...Array(6)].map((_, index) => (
                        <LoadingSkeleton key={index} type="card" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rl-container rl-py-8">
                <Alert type="error" title="Error Loading Categories" message={error} />
                <div className="rl-mt-4">
                    <Button variant="primary" onClick={fetchCategories}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="rl-container rl-py-8">
            {/* Header Section */}
            <div className="rl-mb-8">
                <h1 className="rl-text-4xl rl-font-bold rl-text-neutral-900 rl-mb-2">
                    Product Categories
                </h1>
                <p className="rl-text-lg rl-text-neutral-600">
                    Explore our wide range of fashion categories and discover the perfect style for you.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="rl-card rl-card-body rl-p-6 rl-mb-8">
                <div className="rl-flex rl-flex-col lg:rl-flex-row rl-gap-4 rl-items-center">
                    {/* Search Bar */}
                    <div className="rl-relative rl-flex-1 rl-max-w-md">
                        <FaSearch className="rl-absolute rl-left-3 rl-top-1/2 rl-transform rl-translate-y-[-50%] rl-text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rl-w-full rl-pl-10 rl-pr-4 rl-py-3 search-bar-enhanced rl-rounded-lg focus:rl-ring-2 focus:rl-ring-primary-500 focus:rl-border-primary-500 rl-transition-colors"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="rl-relative">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="rl-appearance-none rl-pl-4 rl-pr-10 rl-py-3 filter-dropdown-enhanced rl-rounded-lg focus:rl-ring-2 focus:rl-ring-primary-500 focus:rl-border-primary-500 rl-transition-colors"
                        >
                            {filterOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <FaFilter className="rl-absolute rl-right-3 rl-top-1/2 rl-transform rl-translate-y-[-50%] rl-text-neutral-400 rl-pointer-events-none" />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="rl-flex rl-border rl-border-neutral-300 rl-rounded-lg rl-overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`rl-px-4 rl-py-3 view-toggle-button ${
                                viewMode === 'grid' 
                                    ? 'rl-bg-primary-500 rl-text-white' 
                                    : 'rl-bg-white rl-text-neutral-600 hover:rl-bg-neutral-50'
                            }`}
                        >
                            <FaTh />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`rl-px-4 rl-py-3 view-toggle-button ${
                                viewMode === 'list' 
                                    ? 'rl-bg-primary-500 rl-text-white' 
                                    : 'rl-bg-white rl-text-neutral-600 hover:rl-bg-neutral-50'
                            }`}
                        >
                            <FaList />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="rl-mb-6">
                <p className="rl-text-neutral-600">
                    Showing {filteredCategories.length} of {categories.length} categories
                </p>
            </div>

            {/* Categories Grid/List */}
            {filteredCategories.length === 0 ? (
                <div className="rl-text-center rl-py-12 empty-state-container rl-p-8">
                    <div className="rl-text-6xl rl-mb-4 empty-state-icon">🔍</div>
                    <h3 className="rl-text-xl rl-font-semibold rl-mb-2 rl-text-neutral-900">
                        No categories found
                    </h3>
                    <p className="rl-text-neutral-600 rl-mb-4">
                        Try adjusting your search terms or filters.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedFilter('all');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className={
                    viewMode === 'grid' 
                        ? 'rl-grid rl-grid-cols-1 md:rl-grid-cols-2 lg:rl-grid-cols-3 xl:rl-grid-cols-4 rl-gap-6'
                        : 'rl-space-y-4'
                }>
                    {filteredCategories.map(category => (
                        <Link 
                            key={category._id || category.id} 
                            to={`/products?category=${category.slug || category.name.toLowerCase()}`}
                            className="rl-block rl-no-underline"
                        >
                            {viewMode === 'grid' ? (
                                <CategoryCard category={category} />
                            ) : (
                                <CategoryListItem category={category} />
                            )}
                        </Link>
                    ))}
                </div>
            )}

            {/* Featured Categories Section */}
            {categories.length > 0 && (
                <div className="rl-mt-16">
                    <h2 className="rl-text-2xl rl-font-bold rl-text-neutral-900 rl-mb-6">
                        Featured Categories
                    </h2>
                    <div className="rl-grid rl-grid-cols-1 md:rl-grid-cols-2 lg:rl-grid-cols-3 rl-gap-6">
                        {categories.slice(0, 3).map(category => (
                            <Link 
                                key={`featured-${category._id || category.id}`} 
                                to={`/products?category=${category.slug || category.name.toLowerCase()}`}
                                className="rl-block rl-no-underline"
                            >
                                <div className="rl-card rl-card-body rl-p-6 rl-h-full featured-category-card rl-cursor-pointer group">
                                    <div className="rl-text-center featured-category-content">
                                        <div className="rl-w-16 rl-h-16 rl-mx-auto rl-mb-4 rl-bg-primary-500 rl-rounded-full rl-flex rl-items-center rl-justify-center rl-text-white rl-text-2xl">
                                            {category.icon || '👕'}
                                        </div>
                                        <h3 className="rl-text-lg rl-font-semibold rl-mb-2 rl-text-neutral-900">
                                            {category.name}
                                        </h3>
                                        <p className="rl-text-sm rl-text-neutral-600 rl-mb-4">
                                            {category.productCount || 0} products available
                                        </p>
                                        <Button variant="primary" size="sm">
                                            Explore Now
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
