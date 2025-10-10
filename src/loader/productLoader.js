// src/loaders/productLoader.js

import { getAllProducts } from "../Services/productServices";


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
