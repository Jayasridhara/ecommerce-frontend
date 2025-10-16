// src/pages/Home.jsx

import { motion } from "framer-motion";
import { apiAddToCart } from "../Services/cartServices";
import { fetchCart, setCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

export default function Home() {
  const products = useLoaderData(); 
  console.log(products)
  // ✅ data from loader
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [priceRange, setPriceRange] = useState(1500);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isSeller, token } = useSelector((state) => state.auth);
  // Compute unique filter options
  const types = useMemo(() => {
    const set_ = new Set();
    products.forEach((p) => p.productType && set_.add(p.productType));
    return Array.from(set_).sort();
  }, [products]);

  const colors = useMemo(() => {
    const set_ = new Set();
    products.forEach((p) => p.color && set_.add(p.color));
    return Array.from(set_).sort();
  }, [products]);

  const ratings = useMemo(() => {
    const set_ = new Set();
    products.forEach((p) => p.rating != null && set_.add(Math.floor(p.rating)));
    return Array.from(set_).sort();
  }, [products]);

  // Filtering logic
  const filtered = products.filter((p) => {
    const matchName = p.name?.toLowerCase().includes(query.toLowerCase());
    const matchType = filterType === "All" || p.productType === filterType;
    const matchRating =
      filterRating === "All" || p.rating >= parseFloat(filterRating);
    const matchColor = filterColor === "All" || p.color === filterColor;
    const matchPrice = p.price <= priceRange;
    return matchName && matchType && matchRating && matchColor && matchPrice;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="text-center py-6 bg-gradient-to-br from-purple-100 via-pink-50 to-white shadow-sm">
        <h2 className="text-4xl font-bold text-gray-800">Upgrade Your Lifestyle</h2>
        <p className="text-gray-500 mt-3">
          Discover the latest and greatest in fashion and electronics.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 mb-10 mt-6">
        <div className="flex flex-wrap justify-center gap-4 p-5 rounded-xl bg-white shadow-sm">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search products..."
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none w-56"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Product Type */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          {/* Rating */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="All">All Ratings</option>
            {ratings.map((r) => (
              <option key={r} value={r}>
                {r}★ & up
              </option>
            ))}
          </select>

          {/* Color */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
          >
            <option value="All">All Colors</option>
            {colors.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Price */}
          <div className="flex flex-col items-center text-gray-700">
            <label className="text-sm mb-1">Max Price: ${priceRange}</label>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-40 accent-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-md mb-3 w-full h-40 object-cover"
                />
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                    {product.name}
                  </h4>
                  <p className="text-blue-600 font-medium">${product.price.toFixed(2)}</p>
                  <p className="text-yellow-500 text-sm mt-1">⭐ {product.rating}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    {product.color} | {product.productType}
                  </p>
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) return navigate('/login');
                    try {
                      const resp = await apiAddToCart(product._id ?? product.id, 1);
                      dispatch(setCart(resp.cart));
                      dispatch(fetchCart()); 
                    } catch (err) {
                      console.error('add to cart failed', err);
                    }
                  }}
                  className="mt-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-3 rounded-md font-semibold transition"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-300 text-gray-500 text-sm bg-white">
        © 2025 ShopVerse
      </footer>
    </section>
  );
}
