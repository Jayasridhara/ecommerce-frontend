
import instance from "../instance/instance";
import protectedInstance from "../instance/protectedInstance";

export const getAllProducts= async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await instance.get(`/products?${searchParams}`);
    console.log(response)
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
  const res = await protectedInstance.get("/products/seller/getproduct", { withCredentials: true });
  console.log(res)
  return res.data.products; // <-- FIXED: plural
};

export const fetchProductById = async (id) => {
  const res = await protectedInstance.get(`/products/${id}`);
  // adjust if response wraps in { product: ... }
  return res.data.product || res.data;
};


export const getFilteredProducts = async (filters) => {
  const response = await instance.get(`/products/filter`, { params: filters });
  return response.data;
};


export const uploadProductImage = async (productId, imageFile) => {
  const form = new FormData();
  form.append('image', imageFile);
  const res = await protectedInstance.post(
    `/products/${productId}/upload-image`,
    form,
    {
      headers: {
        // Let browser set boundary automatically
        "Content-Type": "multipart/form-data",
      }
    }
  );
  return res.data;
};

export const getProductReviews = async (id) => {
  const res = await protectedInstance.get(`/products/${id}/reviews`);
  return res.data;
};

export const addOrUpdateReview = async (id, reviewData) => {
  const res = await protectedInstance.post(`/products/${id}/reviews`, reviewData);
  return res.data;
};