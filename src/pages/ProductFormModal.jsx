import React from "react";
import { X } from "lucide-react";
import ShopDetailsModal from "../components/ShopDetailsModal";
import { toast } from "react-toastify"; 
export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProduct,
}) {
  if (!isOpen) return null;

  // Generic field handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("form data",formData)
  // Image handler with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or WEBP).");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be under 2MB.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageFile: file, image: previewUrl }));
    }
  };

  // ✅ Strong Validation for all fields
  const validateForm = () => {
    const {
      name,
      price,
      color,
      productType,
      productTypeOther,
      description,
      image,
      stock,
    } = formData;

    if (!name.trim()) return "Product name is required.";
    if (!price || Number(price) <= 0)
      return "Price must be a positive number.";
    if (!color.trim()) return "Color is required.";
    if (!productType || productType.trim() === "")
       return "Select a product type.";
    // if (productType === "Other" && !productTypeOther.trim())
    //   return "Please enter a custom product type.";
    if (!description.trim()) return "Description cannot be empty.";
    if (!image) return "Product image is required.";
    if (stock === "" || Number(stock) < 0)
      return "Stock must be 0 or a positive number.";
    if (Number(stock) < 5)
    return "Stock should be at least 5 units.";

    return null; // no error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error); 
      return;
    }
    toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
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
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Product Name *</label>
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
              <label className="block font-medium mb-1">Price ($) *</label>
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
              <label className="block font-medium mb-1">Color *</label>
              <input
                name="color"
                placeholder="Enter color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Product Type */}
          <div className="flex flex-col">
          <label className="block font-medium mb-2 text-gray-700">
            Product Type *
          </label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none appearance-none"
            required
          >
            <option value="">Select a product type</option>
            <option value="Home Accessories">Home Accessories</option>
            <option value="Electonics">Electonics</option>
            <option value="Men's Dress">Men's Dress</option>
            <option value="Women's Dress">Women's Dress</option>
            {/* <option value="Other">Other</option> */}
          </select>
        </div>

          {/* {formData.productType === "Other" && (
            <div>
              <label className="block font-medium mb-1">Other Type *</label>
              <input
                name="productTypeOther"
                placeholder="Enter custom category"
                value={formData.productTypeOther}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          )} */}

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description *</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Product Image *</label>
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

          {/* Stock & Sales Count */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-medium mb-1">Stock *</label>
              <input
                name="stock"
                type="number"
                placeholder="Enter stock quantity"
                value={formData.stock ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
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
