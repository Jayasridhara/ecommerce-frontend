import React, { useState } from "react";
import { X } from "lucide-react";
import protectedInstance from "../instance/protectedInstance";
import { toast } from "react-toastify";

export default function ShopDetailsModal({ show, onClose, onSuccess }) {
  const [form, setForm] = useState({
    shopName: "",
    shopAddress: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    },
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { shopName, shopAddress } = form;
    if (!shopName.trim()) return "Shop name is required";
    const requiredFields = ["addressLine1", "city", "state", "postalCode", "country", "phone"];
    for (const field of requiredFields) {
      if (!shopAddress[field]?.trim()) return `Shop ${field} is required`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) return toast.error(errMsg);

    try {
      await protectedInstance.put("/auth/profile", form);
      toast.success("Shop details saved successfully!");
      onSuccess(); // move to product form
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save shop details");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex justify-between items-center bg-blue-600 text-white px-5 py-3">
          <h2 className="text-lg font-semibold">Complete Your Shop Details</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block mb-1 font-medium">Shop Name</label>
            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <h3 className="text-md font-semibold mt-2">Shop Address</h3>
          {Object.entries(form.shopAddress).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 font-medium">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                name={`shopAddress.${key}`}
                value={value}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
