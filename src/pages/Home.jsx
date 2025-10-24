import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiAddToCart } from "../Services/cartServices";
import { fetchCart, setCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { setUser } from "../redux/authSlice";
import { apiGetFilteredProducts } from "../Services/productServices";

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
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Ensure the user state in Redux is up-to-date
  if (user) {
    dispatch(setUser(user));
  }

  // Load available filter options based on initial products
  useEffect(() => {
    const uniqueTypes = [
      ...new Set(products.map((p) => p.productType).filter(Boolean)),
    ];
    const uniqueColors = [
      ...new Set(products.map((p) => p.color).filter(Boolean)),
    ];
    const uniqueRatings = [
      ...new Set(
        products
          .map((p) => Math.floor(p.rating))
          .filter((r) => r !== undefined && r !== null)
      ),
    ];
    setAvailableFilters({
      types: uniqueTypes,
      colors: uniqueColors,
      ratings: uniqueRatings,
    });
  }, [products]);

  const [filtered, setFiltered] = useState(products);

  // Fetch filtered products when filters or user change
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const resp = await apiGetFilteredProducts(filters);
        // Hide seller’s own products
        const visible = resp.filter(
          (p) => !(user && p.seller && p.seller.id === user.id)
        );
        setFiltered(visible);
        setCurrentPage(1); // Reset to first page when filter changes
      } catch (err) {
        console.error("Filter fetch failed:", err);
        toast.error("Failed to load filtered products");
      }
    };
    fetchFiltered();
    // Note: include filters and user in the dependency array
  }, [filters, user]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // show 8 cards per page

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      query: "",
    });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-8 bg-gradient-to-r from-blue-100 via-white to-purple-100 shadow-sm">
        <h2 className="text-4xl font-extrabold text-gray-800">Upgrade Your Lifestyle</h2>
        <p className="text-gray-600 mt-2 text-lg">
          Discover the latest trends in fashion, electronics, and more.
        </p>
      </section>

      {/* Filters Section */}
      <section className="max-w-5xl mx-auto px-4 my-5">
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
              <option key={i} value={t}>
                {t}
              </option>
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
              <option key={i} value={c}>
                {c}
              </option>
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

      {/* Product Grid Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-45 object-contain bg-white rounded-t-2xl"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-semibold text-lg text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
                    <p className="text-gray-500 text-sm">{product.productType}</p>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.color }}
                      title={product.color}
                    ></div>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (product.stock <= 0) {
                        toast.error("This product is out of stock 🚫");
                        return;
                      }
                      if (!isAuthenticated) {
                        navigate("/login");
                        return;
                      }
                      try {
                        const resp = await apiAddToCart(product._id ?? product.id, 1);
                        dispatch(setCart(resp.cart.cartItems));
                        dispatch(fetchCart());
                        toast.success("Add to cart sucessfully");
                      } catch (err) {
                        console.error("Add to cart failed", err);
                      }
                    }}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full font-semibold transition cursor-pointer"
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

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </section>
  );
}
