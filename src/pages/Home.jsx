import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addToCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import data from "../Dataset/product";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [filterColor, setFilterColor] = useState("All");
  const [priceRange, setPriceRange] = useState(1500);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setProducts(data);
  }, []);

  // Filtering logic
  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(query.toLowerCase());
    const matchType = filterType === "All" || p.productType === filterType;
    const matchRating = filterRating === "All" || p.rating >= parseFloat(filterRating);
    const matchColor = filterColor === "All" || p.color.toLowerCase() === filterColor.toLowerCase();
    const matchPrice = p.price <= priceRange;
    return matchName && matchType && matchRating && matchColor && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16">
        <h2 className="text-4xl font-extrabold text-purple-200">Upgrade Your Lifestyle</h2>
        <p className="text-gray-300 mt-3">
          Discover the latest and greatest in fashion and electronics.
        </p>
      </section>

      {/* Filters */}
   {/* Filters Section */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-4 p-5 rounded-2xl  shadow-lg">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search products..."
            className="px-4 py-2 rounded-lg bg-purple-800/60 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-500 focus:outline-none w-56"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Product Type */}
          <select
            className="px-4 py-2 rounded-lg bg-purple-800/60 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Electronics">Electronics</option>
            <option value="Mens Dress">Men's Dress</option>
            <option value="Women Dress">Women's Dress</option>
          </select>

          {/* Rating */}
          <select
            className="px-4 py-2 rounded-lg bg-purple-800/60 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="All">All Ratings</option>
            <option value="4">4★ & up</option>
            <option value="4.5">4.5★ & up</option>
            <option value="4.8">4.8★ & up</option>
          </select>

          {/* Color */}
          <select
            className="px-4 py-2 rounded-lg bg-purple-800/60 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
          >
            <option value="All">All Colors</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Blue">Blue</option>
            <option value="Red">Red</option>
            <option value="Pink">Pink</option>
            <option value="Brown">Brown</option>
          </select>

          {/* Price Range */}
          <div className="flex flex-col items-center text-white">
            <label className="text-sm mb-1">Max Price: ${priceRange}</label>
            <input
              type="range"
              min="0"
              max="1500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-40 accent-pink-500"
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
                key={product.id}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-purple-800/70 p-4 rounded-xl shadow-md text-center hover:shadow-purple-700 transition cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />
                <h4 className="font-semibold text-purple-100 mb-1">{product.name}</h4>
                <p className="text-gray-300">${product.price.toFixed(2)}</p>
                <p className="text-yellow-400 text-sm mb-2">⭐ {product.rating}</p>
                <p className="text-sm text-gray-400 mb-3">{product.color} | {product.productType}</p>
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-3 rounded-lg font-semibold hover:opacity-90"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-300">No products found.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-purple-700/50 text-gray-400 text-sm">
        © 2025 ShopVerse
      </footer>
    </div>
  );
}
