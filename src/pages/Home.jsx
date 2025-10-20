import { motion } from "framer-motion";
import { apiAddToCart } from "../Services/cartServices";
import { fetchCart, setCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

export default function Home() {
  const products = useLoaderData();
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [priceRange, setPriceRange] = useState(1500);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // filter options
  const types = useMemo(() => [...new Set(products.map(p => p.productType).filter(Boolean))], [products]);
  const colors = useMemo(() => [...new Set(products.map(p => p.color).filter(Boolean))], [products]);
  const ratings = useMemo(() => [...new Set(products.map(p => Math.floor(p.rating)).filter(Boolean))], [products]);

  // filter logic
  const filtered = products.filter((p) => {
    const matchName = p.name?.toLowerCase().includes(query.toLowerCase());
    const matchType = filterType === "All" || p.productType === filterType;
    const matchRating = filterRating === "All" || p.rating >= parseFloat(filterRating);
    const matchColor = filterColor === "All" || p.color === filterColor;
    const matchPrice = p.price <= priceRange;
    return matchName && matchType && matchRating && matchColor && matchPrice;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-100 via-white to-purple-100 shadow-sm">
        <h2 className="text-4xl font-extrabold text-gray-800">Upgrade Your Lifestyle</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Discover the latest trends in fashion, electronics, and more.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 my-8">
        <div className="flex flex-wrap justify-center items-center gap-4 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none w-56"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
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

          <select
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
          >
            <option value="All">All Colors</option>
            {colors.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-600 mb-1">Max Price: ${priceRange}</label>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-44 accent-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h4>
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
                    <p className="text-gray-500 text-sm">{product.productType}</p>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-medium">${product.price.toFixed(2)}</span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.color }}
                      title={product.color}
                    ></div>
                  </div>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!isAuthenticated) return navigate("/login");
                      try {
                        const resp = await apiAddToCart(product._id ?? product.id, 1);
                        dispatch(setCart(resp.cart.cartItems));
                        dispatch(fetchCart());
                      } catch (err) {
                        console.error("Add to cart failed", err);
                      }
                    }}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found.</p>
          )}
        </div>
      </section>

      <footer className="text-center py-6 border-t border-gray-200 text-gray-500 text-sm bg-white">
        © 2025 ShopVerse — All Rights Reserved
      </footer>
    </section>
  );
}
