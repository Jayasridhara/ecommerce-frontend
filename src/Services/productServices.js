
import instance from "../instance/instance";
import protectedInstance from "../instance/protectedInstance";

export const getAllProducts= async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await instance.get(`/products?${searchParams}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await instance.get(`/products/${id}`);
    console.log(response)
    return response.data;

};

export const createProducts = async (productData) => {
    const response = await protectedInstance.post('/products', productData);
    return response.data.product;
};

export const updateProducts = async (id, productData) => {
    const response = await protectedInstance.put(`/products/${id}`, productData);
    return response.data.product;
};

export const deleteProducts = async (id) => {
    const response = await protectedInstance.delete(`/products/${id}`);
    return response.data;
};

export const fetchSellerProducts = async () => {
  const res = await protectedInstance.get("/products/seller", { withCredentials: true });
  return res.data.products; // <-- FIXED: plural
};

export const fetchProductById = async (id) => {
  const res = await protectedInstance.get(`/products/${id}`);
  // adjust if response wraps in { product: ... }
  return res.data.product || res.data;
};

