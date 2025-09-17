import React from 'react';

const LoadingSkeleton = ({ type = 'text', lines = 3, className = '' }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'text':
                return (
                    <div className={className}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`rl-skeleton rl-skeleton-text ${index === lines - 1 ? 'w-75' : ''}`}
                            />
                        ))}
                    </div>
                );
            
            case 'title':
                return (
                    <div className={className}>
                        <div className="rl-skeleton rl-skeleton-text" style={{ height: '1.5em', marginBottom: '0.5rem' }} />
                        <div className="rl-skeleton rl-skeleton-text w-50" />
                    </div>
                );
            
            case 'card':
                return (
                    <div className={`rl-card ${className}`}>
                        <div className="rl-skeleton rl-skeleton-image" style={{ height: '200px' }} />
                        <div className="rl-card-body">
                            <div className="rl-skeleton rl-skeleton-text" style={{ height: '1.25em', marginBottom: '0.5rem' }} />
                            <div className="rl-skeleton rl-skeleton-text w-75" style={{ marginBottom: '0.5rem' }} />
                            <div className="rl-skeleton rl-skeleton-text w-50" />
                        </div>
                    </div>
                );
            
            case 'product-card':
                return (
                    <div className={`rl-product-card ${className}`}>
                        <div className="rl-product-card-image">
                            <div className="rl-skeleton rl-skeleton-image" />
                        </div>
                        <div className="rl-product-card-content">
                            <div className="rl-skeleton rl-skeleton-text" style={{ height: '1.25em', marginBottom: '0.5rem' }} />
                            <div className="rl-skeleton rl-skeleton-text w-75" style={{ marginBottom: '0.5rem' }} />
                            <div className="rl-skeleton rl-skeleton-text w-50" style={{ marginBottom: '0.5rem' }} />
                            <div className="rl-skeleton rl-skeleton-text w-25" />
                        </div>
                    </div>
                );
            
            case 'avatar':
                return (
                    <div className={`rl-skeleton rl-skeleton-avatar ${className}`} />
                );
            
            case 'button':
                return (
                    <div className={`rl-skeleton ${className}`} style={{ height: '40px', width: '120px', borderRadius: '8px' }} />
                );
            
            case 'input':
                return (
                    <div className={`rl-skeleton ${className}`} style={{ height: '48px', borderRadius: '8px' }} />
                );
            
            case 'table':
                return (
                    <div className={className}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <div key={index} className="d-flex gap-3 mb-2">
                                <div className="rl-skeleton rl-skeleton-text" style={{ flex: 1 }} />
                                <div className="rl-skeleton rl-skeleton-text" style={{ flex: 1 }} />
                                <div className="rl-skeleton rl-skeleton-text" style={{ flex: 1 }} />
                                <div className="rl-skeleton rl-skeleton-text" style={{ width: '100px' }} />
                            </div>
                        ))}
                    </div>
                );
            
            case 'list':
                return (
                    <div className={className}>
                        {Array.from({ length: lines }).map((_, index) => (
                            <div key={index} className="d-flex align-items-center gap-3 mb-3">
                                <div className="rl-skeleton rl-skeleton-avatar" />
                                <div className="flex-grow-1">
                                    <div className="rl-skeleton rl-skeleton-text" style={{ height: '1em', marginBottom: '0.25rem' }} />
                                    <div className="rl-skeleton rl-skeleton-text w-75" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            default:
                return (
                    <div className={`rl-skeleton ${className}`} />
                );
        }
    };

    return renderSkeleton();
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8, className = '' }) => {
    return (
        <div className={`row g-4 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3">
                    <LoadingSkeleton type="product-card" />
                </div>
            ))}
        </div>
    );
};

// Page Skeleton
export const PageSkeleton = ({ className = '' }) => {
    return (
        <div className={className}>
            {/* Header */}
            <div className="mb-4">
                <LoadingSkeleton type="title" />
            </div>
            
            {/* Filters */}
            <div className="mb-4">
                <div className="d-flex gap-3 flex-wrap">
                    <LoadingSkeleton type="button" />
                    <LoadingSkeleton type="button" />
                    <LoadingSkeleton type="button" />
                </div>
            </div>
            
            {/* Content */}
            <ProductGridSkeleton count={8} />
        </div>
    );
};

export default LoadingSkeleton;
