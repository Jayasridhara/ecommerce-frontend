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
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          <input
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <div className="flex gap-3">
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-1/2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="w-1/2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select type</option>
            <option>Home Accessories</option>
            <option>Men's Dress</option>
            <option>Women's Dress</option>
            <option>Other</option>
          </select>

          {formData.productType === "Other" && (
            <input
              name="productTypeOther"
              placeholder="Other type"
              value={formData.productTypeOther}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          )}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
          />

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
              className="mt-3 w-full h-44 object-cover rounded-lg border"
            />
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
            >
              {editingProduct ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
