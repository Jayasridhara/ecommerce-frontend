import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateShippingAddress } from "../Services/authServices";

export default function ShippingAddressModal({ show, onClose, onSave, existingData }) {
  const [formData, setFormData] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Prefill data if available
  useEffect(() => {
    if (existingData) setFormData((prev) => ({ ...prev, ...existingData }));
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateShippingAddress(formData);
      toast.success("Shipping address updated successfully!");
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update address");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Update Shipping Address</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {[
            { name: "fullName", label: "Full Name" },
            { name: "addressLine1", label: "Address Line 1" },
            { name: "addressLine2", label: "Address Line 2" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "postalCode", label: "Postal Code" },
            { name: "country", label: "Country" },
            { name: "phone", label: "Phone Number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== "addressLine2"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          ))}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
