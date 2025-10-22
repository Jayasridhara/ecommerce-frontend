
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
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);
  if (filters.color) params.append("color", filters.color);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

  const { data } = await protectedInstance.get(`/products/filter?${params}`);
  return data;
};


export const apiGetFilteredProducts = async (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const resp = await protectedInstance.get(`/products/allproductfilter?${params.toString()}`);
  return resp.data;
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