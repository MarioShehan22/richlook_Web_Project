import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "wishlist";

const getStored = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(getStored);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const isInWishlist = (id) =>
        wishlistItems.some((it) => it._id === id || it.id === id);

    const addToWishlist = (product) => {
        console.log(product);
        const id = product && (product._id || product.id);
        if (!id) return;

        if (isInWishlist(id)) return; // already in wishlist

        const entry = {
            _id: id,
            name: product.name,
            image: product.thumbnailUrl || product.images?.[0]?.url || "",
            price: Number(product.price) || 0,
            // add other fields as you need (brand, slug, etc)
            slug: product.slug || undefined,
            brand: product.brand || undefined,
        };

        setWishlistItems((prev) => [...prev, entry]);
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((prev) => prev.filter((it) => (it._id || it.id) !== id));
    };

    const toggleWishlist = (product) => {
        const id = product && (product._id || product.id);
        if (!id) return;
        setWishlistItems((prev) =>
            prev.some((it) => (it._id || it.id) === id)
                ? prev.filter((it) => (it._id || it.id) !== id)
                : [
                    ...prev,
                    {
                        _id: id,
                        name: product.name,
                        image: product.thumbnailUrl || product.images?.[0]?.url || "",
                        price: Number(product.price) || 0,
                        slug: product.slug || undefined,
                        brand: product.brand || undefined,
                    },
                ]
        );
    };

    const clearWishlist = () => setWishlistItems([]);

    const value = useMemo(
        () => ({
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            clearWishlist,
        }),
        [wishlistItems]
    );

    return (
        <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);