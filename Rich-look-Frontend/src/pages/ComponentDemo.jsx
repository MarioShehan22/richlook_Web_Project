import React, { useState } from 'react';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Alert, { ToastContainer, Toast } from '../components/Alert';
import LoadingSkeleton, { ProductGridSkeleton } from '../components/LoadingSkeleton';
import ProductCard from '../components/ProductCard';
import { FaShoppingCart, FaHeart, FaEye, FaUser, FaSearch } from 'react-icons/fa';

const ComponentDemo = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [showToast, setShowToast] = useState(false);

    const handleFormChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddToCart = (product) => {
        console.log('Adding to cart:', product);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddToWishlist = (product) => {
        console.log('Adding to wishlist:', product);
    };

    const handleQuickView = (product) => {
        console.log('Quick view:', product);
    };

    // Sample product data
    const sampleProduct = {
        _id: '1',
        name: 'Sample Product',
        brand: 'Sample Brand',
        price: 2500,
        originalPrice: 3000,
        discount: 17,
        thumbnailUrl: 'https://via.placeholder.com/300x300/3b82f6/ffffff?text=Product',
        slug: 'sample-product'
    };

    return (
        <div className="container py-5">
            <h1 className="rl-text-4xl rl-font-bold rl-mb-8 text-center">Design System Components</h1>

            {/* Buttons Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Buttons</h2>
                <div className="rl-card rl-card-body">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Variants</h3>
                            <div className="d-flex flex-wrap gap-3">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="danger">Danger</Button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Sizes</h3>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                <Button variant="primary" size="sm">Small</Button>
                                <Button variant="primary">Default</Button>
                                <Button variant="primary" size="lg">Large</Button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">With Icons</h3>
                            <div className="d-flex flex-wrap gap-3">
                                <Button variant="primary" icon={<FaShoppingCart />}>
                                    Add to Cart
                                </Button>
                                <Button variant="secondary" icon={<FaHeart />} iconPosition="right">
                                    Wishlist
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">States</h3>
                            <div className="d-flex flex-wrap gap-3">
                                <Button variant="primary" loading>Loading</Button>
                                <Button variant="primary" disabled>Disabled</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Inputs Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Form Inputs</h2>
                <div className="rl-card rl-card-body">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <FormInput
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <FormInput
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                placeholder="Enter your email"
                                error="Please enter a valid email address"
                                required
                            />
                        </div>
                        <div className="col-12">
                            <FormInput
                                label="Message"
                                type="textarea"
                                name="message"
                                value={formData.message}
                                onChange={handleFormChange}
                                placeholder="Enter your message"
                                floating={false}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Alerts Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Alerts</h2>
                <div className="space-y-4">
                    <Alert type="success" title="Success!" message="Operation completed successfully." />
                    <Alert type="warning" title="Warning!" message="Please review your input before proceeding." />
                    <Alert type="error" title="Error!" message="Something went wrong. Please try again." />
                    <Alert type="info" title="Info" message="Here's some helpful information." />
                </div>
            </section>

            {/* Loading Skeletons Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Loading Skeletons</h2>
                <div className="rl-card rl-card-body">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Text Skeleton</h3>
                            <LoadingSkeleton type="text" lines={3} />
                        </div>
                        <div className="col-md-4">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Title Skeleton</h3>
                            <LoadingSkeleton type="title" />
                        </div>
                        <div className="col-md-4">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Button Skeleton</h3>
                            <LoadingSkeleton type="button" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Card Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Product Card</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <ProductCard
                            product={sampleProduct}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onQuickView={handleQuickView}
                        />
                    </div>
                    <div className="col-md-4">
                        <ProductCard
                            product={{
                                ...sampleProduct,
                                _id: '2',
                                name: 'Another Product',
                                price: 1800,
                                originalPrice: null,
                                discount: null,
                                thumbnailUrl: 'https://via.placeholder.com/300x300/22c55e/ffffff?text=Product'
                            }}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onQuickView={handleQuickView}
                        />
                    </div>
                    <div className="col-md-4">
                        <ProductCard
                            product={{
                                ...sampleProduct,
                                _id: '3',
                                name: 'Premium Product',
                                price: 4500,
                                originalPrice: 6000,
                                discount: 25,
                                thumbnailUrl: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Product'
                            }}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onQuickView={handleQuickView}
                        />
                    </div>
                </div>
            </section>

            {/* Product Grid Skeleton Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Product Grid Skeleton</h2>
                <ProductGridSkeleton count={6} />
            </section>

            {/* Utility Classes Section */}
            <section className="rl-mb-8">
                <h2 className="rl-text-2xl rl-font-semibold rl-mb-4">Utility Classes</h2>
                <div className="rl-card rl-card-body">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Typography</h3>
                            <p className="rl-text-xs">Extra Small Text</p>
                            <p className="rl-text-sm">Small Text</p>
                            <p className="rl-text-base">Base Text</p>
                            <p className="rl-text-lg">Large Text</p>
                            <p className="rl-text-xl">Extra Large Text</p>
                            <p className="rl-text-2xl rl-font-bold">Bold Large Text</p>
                        </div>
                        <div className="col-md-6">
                            <h3 className="rl-text-lg rl-font-medium rl-mb-3">Spacing & Shadows</h3>
                            <div className="rl-p-4 rl-mb-3 rl-shadow-sm rl-rounded-lg rl-bg-neutral-50">
                                Small Shadow
                            </div>
                            <div className="rl-p-4 rl-mb-3 rl-shadow rl-rounded-lg rl-bg-neutral-50">
                                Base Shadow
                            </div>
                            <div className="rl-p-4 rl-mb-3 rl-shadow-lg rl-rounded-lg rl-bg-neutral-50">
                                Large Shadow
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toast Container */}
            <ToastContainer position="top-right">
                {showToast && (
                    <Toast
                        type="success"
                        title="Success!"
                        message="Product added to cart successfully."
                        duration={3000}
                        onDismiss={() => setShowToast(false)}
                    />
                )}
            </ToastContainer>
        </div>
    );
};

export default ComponentDemo;
