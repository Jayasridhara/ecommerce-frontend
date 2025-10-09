import React, { useState, useEffect } from "react";
import { Edit3, Trash2, PlusCircle } from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import {
  fetchSellerProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  uploadProductImage,
} from "../Services/productServices";
import Navbar from "../components/Navbar";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
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
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchSellerProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      let savedProduct;
      if (editingProduct) {
        savedProduct = await updateProducts(editingProduct._id, formData);
      } else {
        savedProduct = await createProducts(formData);
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
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesName = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || p.productType === category;
    return matchesName && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar/>
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
          🛍️ Seller Dashboard
        </h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingProduct(null);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition"
        >
          <PlusCircle className="mr-2" size={18} /> Add Product
        </button>
      </header>

      {/* Search & Filter */}
      <div className="bg-white shadow-sm mx-8 mt-6 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search products..."
          className="border rounded-lg px-3 py-2 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option>All</option>
          <option>Home Accessories</option>
          <option>Men's Dress</option>
          <option>Women's Dress</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 px-8 py-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative h-40 bg-gray-100">
                <img
                  src={prod.image || "https://via.placeholder.com/300x200?text=No+Image"}
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
              <div className="p-3">
                <h2 className="font-semibold text-base truncate">{prod.name}</h2>
                <p className="text-xs text-gray-500">{prod.productType}</p>
                <p className="text-blue-600 font-semibold mt-1">${prod.price}</p>
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
