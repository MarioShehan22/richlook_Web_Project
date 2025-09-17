import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const formatLKR = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const getCartItemsFromLocalStorage = () => {
    try {
        const stored = localStorage.getItem('cart');
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getCartItemsFromLocalStorage);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleQtyChange = (_id, value) => {
        const qty = Math.max(1, Number(value || 1));
        setCartItems((items) =>
            items.map((it) => (it._id === _id ? { ...it, quantity: qty } : it))
        );
    };

    const incrementQty = (_id) => {
        setCartItems((items) => {
            const item = items.find((it) => it._id === _id);
            if (!item) return items; // guard
            return items.map((it) =>
                it._id === _id ? { ...it, quantity: (Number(it.quantity) || 0) + 1 } : it
            );
        });
    };

    const decrementQty = (_id) => {
        setCartItems((items) => {
            const item = items.find((it) => it._id === _id);
            if (!item) return items; // guard
            const next = Math.max(1, (Number(item.quantity) || 1) - 1);
            return items.map((it) => (it._id === _id ? { ...it, quantity: next } : it));
        });
    };

    const removeItem = (_id) => {
        setCartItems((items) => items.filter((it) => it._id !== _id));
    };

    const addToCart = (product, { size, color, priceOverride } = {}) => {
        const id = product && (product._id || product.id);
        if (!id) return;

        const img = product.thumbnailUrl || product.images?.[0]?.url || '';
        const price = Number(priceOverride ?? product.price) || 0;

        setCartItems(items => {
            // Treat different size/color as different lines
            const key = `${id}::${size || ''}::${color || ''}`;
            const existing = items.find(it => it._key === key);
            if (existing) {
                return items.map(it => it._key === key ? { ...it, quantity: (it.quantity || 0) + 1 } : it);
            }
            return [
                ...items,
                {
                    _key: key,            // internal unique key
                    _id: id,
                    name: product.name,
                    image: img,
                    price,
                    quantity: 1,
                    size: size || null,   // <-- important
                    color: color || null, // <-- important
                }
            ];
        });
    };


    const subtotal = cartItems.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                addToCart,
                incrementQty,
                decrementQty,
                removeItem,
                handleQtyChange,
                subtotal,
                formatLKR,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);