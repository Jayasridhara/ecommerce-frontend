import React, { useState, useEffect } from "react";
import { Edit3, Trash2, PlusCircle, SlidersHorizontal } from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import Navbar from "../components/Navbar";
import {
  fetchSellerProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  uploadProductImage,
  getFilteredProducts, // 👈 new API call for filtering
} from "../Services/productServices";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    color: "",
    minPrice: undefined ,
    maxPrice: undefined ,
  });
  const [availableFilters, setAvailableFilters] = useState({
    types: [],
    colors: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    color: "",
    productType: "",
    productTypeOther: "",
    description: "",
    image: "",
    imageFile: null,
    stock: 0,      // new
    salesCount: 0,  // new
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // 🚀 Load all products & extract available filters dynamically
  const loadProducts = async () => {
    try {
      const data = await fetchSellerProducts();
      const productArray = Array.isArray(data) ? data : [];
      setProducts(productArray);

      // Extract unique filter options
      const uniqueTypes = [...new Set(productArray.map((p) => p.productType))];
      const uniqueColors = [...new Set(productArray.map((p) => p.color))];
      setAvailableFilters({ types: uniqueTypes, colors: uniqueColors });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // 🧭 Handle filtering via backend API
  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    try {
      const res = await getFilteredProducts(updatedFilters);
      setProducts(Array.isArray(res.products) ? res.products : []);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
         const payload = {
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
        stock: formData.stock === "" ? 0 : Number(formData.stock),
        salesCount: formData.salesCount === "" ? 0 : Number(formData.salesCount),
        productType:
          formData.productType === "Other" && formData.productTypeOther
            ? formData.productTypeOther
            : formData.productType,
      }
      let savedProduct;
      if (editingProduct) {
        savedProduct = await updateProducts(editingProduct._id, payload);
      } else {
        savedProduct = await createProducts(payload);
      }

      if (formData.imageFile) {
        await uploadProductImage(savedProduct._id, formData.imageFile);
      }

      await loadProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this product?")) {
      await deleteProducts(id);
      await loadProducts();
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      color: "",
      productType: "",
      productTypeOther: "",
      description: "",
      image: "",
      imageFile: null,
      stock: 0,
      salesCount: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          🛍️ Seller Dashboard
        </h1>
        <button type="button"
          onClick={() => {
            setIsModalOpen(true);
            setEditingProduct(null);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition"
        >
          <PlusCircle className="mr-2" size={18} /> Add Product
        </button>
      </header>

      {/* Filters Section */}
      <div className="bg-white shadow-sm mx-8 mt-6 rounded-xl p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <SlidersHorizontal size={18} />
          Filters
        </div>

        {/* Product Type */}
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
        >
          <option value="">All Types</option>
          {availableFilters.types.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Color */}
        <select
          name="color"
          value={filters.color}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
        >
          <option value="">All Colors</option>
          {availableFilters.colors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300"
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-8 py-8">
        {products.length > 0 ? (
          products.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100">
                <img
                  src={
                    prod.image || "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setFormData({
                        name: prod.name,
                        price: prod.price,
                        color: prod.color,
                        productType: prod.productType,
                        productTypeOther: prod.productTypeOther,
                        description: prod.description,
                        image: prod.image,
                        imageFile: null,
                        stock: prod.stock || 0,
                        salesCount: prod.salesCount || 0,
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 bg-white/90 rounded-full hover:bg-blue-100 transition"
                  >
                    <Edit3 size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="p-1.5 bg-white/90 rounded-full hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-800 truncate">
                {prod.name}
              </h2>

              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">{prod.productType}</p>
                {prod.color && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Color:</span>
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: prod.color.toLowerCase() }}
                      title={prod.color}
                    ></div>
                  </div>
                )}
              </div>

            <p className="text-blue-600 font-bold text-base mt-2">
              ${prod.price}
            </p>
              <p className="text-gray-500 text-sm mt-1">
              Stock: {prod.stock} | Sold: {prod.salesCount}
              </p>
</div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">
            No products found.
          </p>
        )}
      </div>

      {/* Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleAddOrUpdate}
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
      />
    </div>
  );
}
