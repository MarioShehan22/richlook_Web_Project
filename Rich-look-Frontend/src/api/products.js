import axiosInstance from "../config/axiosConfig.js";

export const listProducts = (params) =>
    axiosInstance.get("products", { params });

export const getProductById = (id) =>
    axiosInstance.get(`products/find-By-id/${id}`);

export const createProduct = (payload) =>
    axiosInstance.post("products/add", payload);

export const updateProduct = (id, payload) =>
    axiosInstance.put(`products/${id}`, payload);

export const deleteProduct = (id) =>
    axiosInstance.delete(`products/${id}`);
