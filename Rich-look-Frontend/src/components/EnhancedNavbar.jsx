import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Button from './Button';

const EnhancedNavbar = ({ cartCount = 0, wishlistCount = 0 }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results
            window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/categories', label: 'Categories' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' }
    ];

    return (
        <nav className={`rl-navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="rl-container">
                <div className="d-flex align-items-center justify-content-between py-3">
                    {/* Logo */}
                    <Link to="/" className="rl-navbar-brand">
                        Rich Look
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="d-none d-lg-flex align-items-center gap-4">
                        <ul className="rl-navbar-nav">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link 
                                        to={link.to} 
                                        className={`rl-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Search Bar */}
                    <div className="d-none d-md-flex align-items-center gap-3 flex-grow-1 mx-4">
                        <form onSubmit={handleSearch} className="flex-grow-1">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="rl-form-input"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="rl-btn rl-btn-icon rl-btn-sm position-absolute"
                                    style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* User Actions */}
                    <div className="d-flex align-items-center gap-2">
                        {/* Wishlist */}
                        <Link to="/wishlist" className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost position-relative">
                            <FaHeart />
                            {wishlistCount > 0 && (
                                <span className="rl-badge rl-badge-error position-absolute" 
                                      style={{ top: '-8px', right: '-8px', fontSize: '10px' }}>
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost position-relative">
                            <FaShoppingCart />
                            {cartCount > 0 && (
                                <span className="rl-badge rl-badge-error position-absolute" 
                                      style={{ top: '-8px', right: '-8px', fontSize: '10px' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Account */}
                        <Link to="/login" className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost">
                            <FaUser />
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="rl-btn rl-btn-icon rl-btn-sm rl-btn-ghost d-lg-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="d-md-none mb-3">
                    <form onSubmit={handleSearch}>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="rl-form-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="rl-btn rl-btn-icon rl-btn-sm position-absolute"
                                style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <FaSearch />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="d-lg-none border-top pt-3 pb-3">
                        <ul className="list-unstyled mb-0">
                            {navLinks.map((link) => (
                                <li key={link.to} className="mb-2">
                                    <Link 
                                        to={link.to} 
                                        className={`rl-nav-link d-block ${location.pathname === link.to ? 'active' : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default EnhancedNavbar;
