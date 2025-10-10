// src/loaders/productLoader.js

import { getAllProducts, getProductById, getProductReviews } from "../Services/productServices";


export const productsLoader = async () => {
  try {
    const res = await getAllProducts();
    // handle if response is { products: [...] } or just array
    const list = res.products || res;
    return list;
  } catch (err) {
    console.error("Error loading products:", err);
    throw new Response("Failed to load products", { status: 500 });
  }
};

export async function productsByIdLoader({ params }) {
  const { id } = params;

  try {
    const productRes = await getProductById(id);
    const reviewRes = await getProductReviews(id);

    // you could combine into one object
    return {
      product: productRes.product,
      reviews: reviewRes.reviews || [],
    };
  } catch (error) {
    console.error("Loader error:", error);
   
    throw error;
   
  }
}