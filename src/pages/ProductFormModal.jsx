import React from "react";
import { X } from "lucide-react";

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProduct,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageFile: file, image: previewUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name.trim()) return alert("Product name is required");
    if (!formData.price || formData.price <= 0)
      return alert("Price must be greater than 0");
    if (!formData.productType) return alert("Select a product type");
    if (formData.productType === "Other" && !formData.productTypeOther.trim())
      return alert("Enter other type name");

    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-blue-600 text-white">
          <h3 className="text-lg font-semibold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="hover:text-gray-200 transition">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Price & Color */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Color</label>
              <input
                name="color"
                placeholder="Enter color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Product Type */}
          <div>
            <label className="block font-medium mb-1">Product Type</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">Select type</option>
              <option>Home Accessories</option>
              <option>Men's Dress</option>
              <option>Women's Dress</option>
              <option>Other</option>
            </select>
          </div>

          {formData.productType === "Other" && (
            <div>
              <label className="block font-medium mb-1">Other Type</label>
              <input
                name="productTypeOther"
                placeholder="Enter other type"
                value={formData.productTypeOther}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block font-medium mb-1">Product Image</label>
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block text-sm text-gray-600"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-full h-44 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Stock & Sell Count */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                placeholder="Enter stock"
                value={formData.stock ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Sold Count</label>
              <input
                name="salesCount"
                type="number"
                placeholder="Enter sold count"
                value={formData.salesCount ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                min={0}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
            >
              {editingProduct ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
