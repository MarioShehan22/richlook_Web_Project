import React from 'react';

export default function VariantPicker({ product, selectedColor, selectedSize, onChange }) {
    if (!product) return null;

    const variants = Array.isArray(product.variants) ? product.variants : [];

    // unique colors from variants that have stock
    const colors = Array.from(
        new Set(variants.filter(v => (v.quantity ?? 0) > 0).map(v => v.color))
    );

    // sizes for the selected color (show all sizes for that color; disable when qty 0)
    const sizesForColor = variants
        .filter(v => v.color === selectedColor)
        .map(v => ({ size: v.size, qty: v.quantity ?? 0 }));

    return (
        <div className="variant-picker">
            {/* Colors */}
            <div className="mb-3">
                <div className="fw-semibold mb-1">Color</div>
                <div className="d-flex flex-wrap gap-2">
                    {colors.map((c) => {
                        const isActive = c === selectedColor;
                        return (
                            <button
                                key={c}
                                type="button"
                                className={`btn btn-sm ${isActive ? 'btn-dark' : 'btn-outline-dark'}`}
                                onClick={() => onChange({ color: c, size: '' /* reset size on color change */ })}
                                aria-pressed={isActive}
                            >
                                {c}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sizes */}
            {selectedColor && (
                <div className="mb-2">
                    <div className="fw-semibold mb-1">Size</div>
                    <div className="d-flex flex-wrap gap-2">
                        {sizesForColor.map(({ size, qty }) => {
                            const disabled = qty <= 0;
                            const isActive = size === selectedSize;
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}
                                    disabled={disabled}
                                    onClick={() => onChange({ color: selectedColor, size })}
                                    title={disabled ? 'Out of stock' : ''}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                    {!selectedSize && <small className="text-muted">Choose a size</small>}
                </div>
            )}
        </div>
    );
}