import { motion } from "framer-motion";
import { apiAddToCart } from "../Services/cartServices";
import { fetchCart, setCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useMemo, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { setUser } from "../redux/authSlice";
export default function Home() {
  const products = useLoaderData() || [];
  const [filters, setFilters] = useState({
    type: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    query: "",
  });
  const [availableFilters, setAvailableFilters] = useState({
    types: [],
    colors: [],
    ratings: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user,isAuthenticated } = useSelector((state) => state.auth);

  console.log("User in Home:", user);
   
   if (user) {
      dispatch(setUser(user));
    }
  // Load available filters from products
  useEffect(() => {
    const uniqueTypes = [...new Set(products.map((p) => p.productType).filter(Boolean))];
    const uniqueColors = [...new Set(products.map((p) => p.color).filter(Boolean))];
    const uniqueRatings = [...new Set(products.map((p) => Math.floor(p.rating)).filter(Boolean))];
    setAvailableFilters({ types: uniqueTypes, colors: uniqueColors, ratings: uniqueRatings });
  }, [products]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      query: "",
    });
  };

  // Apply filtering logic
  const filtered = useMemo(() => {
    return products.filter((p) => {
       // hide seller’s own products
      if (user && p.seller && p.seller.id === user.id) {
        return false;
      }
      const matchName = p.name?.toLowerCase().includes(filters.query.toLowerCase());
      const matchType = !filters.type || p.productType === filters.type;
      const matchColor = !filters.color || p.color === filters.color;
      const matchMin = !filters.minPrice || p.price >= Number(filters.minPrice);
      const matchMax = !filters.maxPrice || p.price <= Number(filters.maxPrice);
      return matchName && matchType && matchColor && matchMin && matchMax;
    });
  }, [products, filters,user]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
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
            name="query"
            placeholder="Search products..."
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none w-56"
            value={filters.query}
            onChange={handleFilterChange}
          />

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Types</option>
            {availableFilters.types.map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>

          <select
            name="color"
            value={filters.color}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Colors</option>
            {availableFilters.colors.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-20 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-20 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition font-medium"
          >
            Clear Filters
          </button>
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
                       if (product.stock <=0) {
                        toast.error("This product is out of stock 🚫");
                        return;
                      }

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
