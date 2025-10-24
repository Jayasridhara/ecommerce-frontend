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
  getFilteredProducts,
} from "../Services/productServices";
import ReportSection from "./ReportSection";
import { getMe } from "../Services/authServices";
import { toast } from "react-toastify";
import ShopDetailsModal from "../components/ShopDetailsModal";
export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    color: "",
    minPrice: undefined,
    maxPrice: undefined,
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
    stock: 0,
    salesCount: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showReport, setShowReport] = useState(false);
 const [showOutOfStock, setShowOutOfStock] = useState(false);
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchSellerProducts();
      const productArray = Array.isArray(data) ? data : [];
      setProducts(productArray);

      const uniqueTypes = [...new Set(productArray.map((p) => p.productType))];
      const uniqueColors = [...new Set(productArray.map((p) => p.color))];
      setAvailableFilters({ types: uniqueTypes, colors: uniqueColors });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

const handleFilterChange = async (e) => {
  const { name, value } = e.target;
  const updatedFilters = {
    ...filters,
    [name]: value === "" ? undefined : value,
  };
  setFilters(updatedFilters);

  try {
    const isFilterEmpty =
      !updatedFilters.type &&
      !updatedFilters.color &&
      (updatedFilters.minPrice == null || updatedFilters.minPrice === "") &&
      (updatedFilters.maxPrice == null || updatedFilters.maxPrice === "") &&
      !showOutOfStock;

    if (isFilterEmpty) {
      await loadProducts();
      return;
    }

    // ✅ include outOfStock filter
    const data = await getFilteredProducts({
      ...updatedFilters,
      outOfStock: showOutOfStock,
    });

    const productArray = Array.isArray(data) ? data : [];
    setProducts(productArray);
  } catch (error) {
    console.error("Error applying filters:", error);
    toast.error("Failed to apply filters");
  }
};
  const handleAddOrUpdate = async () => {
    try {
      const payload = {
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
        stock: formData.stock === "" ? 0 : Number(formData.stock),
        salesCount:
          formData.salesCount === "" ? 0 : Number(formData.salesCount),
        productType:
          formData.productType === "Other" && formData.productTypeOther
            ? formData.productTypeOther
            : formData.productType,
      };

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
    if (window.confirm("Are you sure to delete this product?")) {
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


  const [showShopModal, setShowShopModal] = useState(false);

const checkSellerDetails = async () => {
  try {
    const data = await getMe(); // your API
    const user = data?.user || data;

    if (!user) {
      toast.error("User not found!");
      return;
    }

    const shop = user.shopAddress || {};
    const isShopComplete =
      user.shopName?.trim() &&
      shop.addressLine1?.trim() &&
      shop.city?.trim() &&
      shop.state?.trim() &&
      shop.postalCode?.trim() &&
      shop.country?.trim() &&
      shop.phone?.trim();

    if (!isShopComplete) {
      setShowShopModal(true); // show popup to complete details
    } else {
      setIsModalOpen(true); // directly open ProductFormModal
    }
  } catch (err) {
    toast.error("Failed to verify shop details");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      <header className="bg-white shadow-md py-2 px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 z-10 border-b">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight mb-2 sm:mb-0">
          🛍️ Seller Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowReport((prev) => !prev)}
            className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow transition"
          >
            📊 Reports
          </button>
          <button
          type="button"
          onClick={checkSellerDetails}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition"
        >
          <PlusCircle className="mr-2" size={18} /> Add Product
        </button>
        </div>
      </header>
{ !showReport && (
      <div className="bg-white shadow-sm mx-4 sm:mx-8 mt-6 rounded-xl p-4 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4">
       <div className="flex items-center gap-2 text-gray-600 font-medium w-full sm:w-auto">
          <SlidersHorizontal size={18} />
          Filters

        <button
          type="button"
          onClick={async () => {
            const newState = !showOutOfStock;
            setShowOutOfStock(newState);

            if (newState) {
              // 🧠 Show only products with stock <= 0
              try {
                const data = await fetchSellerProducts();
                const productArray = Array.isArray(data) ? data : [];
                const outOfStockProducts = productArray.filter(
                  (p) => Number(p.stock) <= 0
                );
                setProducts(outOfStockProducts);
              } catch (err) {
                console.error("Error filtering out of stock:", err);
                toast.error("Failed to load out-of-stock products");
              }
            } else {
              // 🧹 Reset back to all products
              await loadProducts();
            }
          }}
          className={`ml-2 px-4 py-2 rounded-lg shadow transition ${
            showOutOfStock
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Out of Stock
        </button>

          <button
            className="ml-auto sm:ml-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition"
            onClick={() => {
              setFilters({
                type: "",
                color: "",
                minPrice: undefined,
                maxPrice: undefined,
              });
              setShowOutOfStock(false);
              loadProducts();
            }}
          >
            Clear Filters
          </button>
        </div>


        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="w-full sm:w-auto border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
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
          className="w-full sm:w-auto border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
        >
          <option value="">All Colors</option>
          {availableFilters.colors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={handleFilterChange}
            className="w-full sm:w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300"
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={handleFilterChange}
            className="w-full sm:w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      )}
      <div className="px-4 sm:px-8 py-8">
        {showReport ? (
          <ReportSection onClose={() => setShowReport(false)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.length > 0 ? (
              products.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative h-32 sm:h-40 bg-gray-100">
                    <img
                      src={
                        prod.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
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
                            productType: prod.productType || "",
                            productTypeOther: prod.productTypeOther,
                            description: prod.description,
                            image: prod.image,
                            imageFile: null,
                            stock: prod.stock || 0,            
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
                  <div className="p-3 sm:p-4">
                    <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
                      {prod.name}
                    </h2>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        {prod.productType}
                      </p>
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
                    
                    <div className="flex justify-between mt-2">
                       <p
                          className={`text-sm mt-1 font-semibold ${
                            prod.stock === 0 ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          Stock: {prod.stock === 0 ? "Out of Stock" : prod.stock}
                        </p>
                      <p className="text-gray-500 text-sm">
                        Sales: {prod.salesCount}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500 text-lg">
                No products found.
              </p>
            )}
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={resetForm}
        onSubmit={handleAddOrUpdate}
        formData={formData}
        setFormData={setFormData}
        editingProduct={editingProduct}
      />
     <ShopDetailsModal
       show={showShopModal}
       onClose={() => setShowShopModal(false)}
       onSuccess={() => {
         setShowShopModal(false);
         setIsModalOpen(true); // open product modal after saving
       }}
     />
    </div>
  );
}
