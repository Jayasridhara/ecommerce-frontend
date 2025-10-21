import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, setLoading, setError, clearUser, setUser } from '../redux/authSlice';
import protectedInstance from '../instance/protectedInstance';
import defaultImage from "../assets/avatar-character.jpg";
import Navbar from './Navbar';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertModal from '../pages/AlertModal';
import { deleteProfile,getMe } from '../Services/authServices';
import { useNavigate } from 'react-router';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    profilePicture: '',
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    shopName: '',
    shopAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState(null);
  const [reload, setReload] = useState(0);

   
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await getMe();
        const updated = data.user || data;

        if (!updated) return;

        dispatch(setUser(updated));
        setForm({
          name: updated.name || '',
          phone: updated.phone || '',
          location: updated.location || '',
          profilePicture: updated.profilePicture || '',
          shippingAddress: {
            fullName: updated.shippingAddress?.fullName || '',
            addressLine1: updated.shippingAddress?.addressLine1 || '',
            addressLine2: updated.shippingAddress?.addressLine2 || '',
            city: updated.shippingAddress?.city || '',
            state: updated.shippingAddress?.state || '',
            postalCode: updated.shippingAddress?.postalCode || '',
            country: updated.shippingAddress?.country || '',
            phone: updated.shippingAddress?.phone || '',
          },
          shopName: updated.shopName || '',
          shopAddress: {
            fullName: updated.shopAddress?.fullName || '',
            addressLine1: updated.shopAddress?.addressLine1 || '',
            addressLine2: updated.shopAddress?.addressLine2 || '',
            city: updated.shopAddress?.city || '',
            state: updated.shopAddress?.state || '',
            postalCode: updated.shopAddress?.postalCode || '',
            country: updated.shopAddress?.country || '',
            phone: updated.shopAddress?.phone || '',
          },
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to fetch profile");
      }
    };

    fetchUserProfile();
  }, [dispatch]);
; 
  const validateForm = () => {
    const newErrors = {};
    const isEmpty = str => !str || str.trim() === '';

    if (isEmpty(form.name)) newErrors.name = "Name is required";
    if (isEmpty(form.phone)) newErrors.phone = "Phone is required";
    if (isEmpty(form.location)) newErrors.location = "Location is required";

    const sa = form.shippingAddress;
    if (isEmpty(sa.fullName)) newErrors["shippingAddress.fullName"] = "Shipping full name required";
    if (isEmpty(sa.addressLine1)) newErrors["shippingAddress.addressLine1"] = "Address line1 required";
    if (isEmpty(sa.city)) newErrors["shippingAddress.city"] = "City is required";
    if (isEmpty(sa.state)) newErrors["shippingAddress.state"] = "State is required";
    if (isEmpty(sa.postalCode)) newErrors["shippingAddress.postalCode"] = "Postal code is required";
    if (isEmpty(sa.country)) newErrors["shippingAddress.country"] = "Country is required";
    if (isEmpty(sa.phone)) newErrors["shippingAddress.phone"] = "Phone is required";

    if (user?.role === "seller") {
      if (isEmpty(form.shopName)) newErrors.shopName = "Shop name is required";
      const sb = form.shopAddress;
      if (isEmpty(sb.addressLine1)) newErrors["shopAddress.addressLine1"] = "Shop address line1 required";
      if (isEmpty(sb.city)) newErrors["shopAddress.city"] = "Shop city is required";
      if (isEmpty(sb.state)) newErrors["shopAddress.state"] = "Shop state is required";
      if (isEmpty(sb.postalCode)) newErrors["shopAddress.postalCode"] = "Shop postal code is required";
      if (isEmpty(sb.country)) newErrors["shopAddress.country"] = "Shop country is required";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, key] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(setError(null));

    const { isValid, newErrors } = validateForm();
    if (!isValid) {
      const firstKey = Object.keys(newErrors)[0];
      const msg = firstKey ? newErrors[firstKey] : "Validation failed";
      toast.error(msg);
      return;
    }

    dispatch(setLoading(true));
    try {
      const resp = await protectedInstance.put('/auth/profile', form);
      const updated = resp.data.user;
      dispatch(updateUser(updated));
      setForm(prev => ({ ...prev, ...updated }));
      toast.success('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };



  const handleRefresh = () => {
    setAlertAction("refresh");
    setAlertMessage("Are you sure you want to refresh? This will clear all fields.");
    setAlertModalOpen(true);
  };

  const handleModalConfirm = async () => {
    setAlertModalOpen(false);
   if (alertAction === "refresh") {
      setForm({
        name: '',
        phone: '',
        location: '',
        profilePicture: '',
        shippingAddress: {
          fullName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          phone: '',
        },
        shopName: '',
        shopAddress: {
          fullName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          phone: '',
        },
      });
      toast.info("Profile fields cleared");
    }
  };

  const handleModalClose = () => setAlertModalOpen(false);

  if (!user) return <div className="text-center py-20">Loading profile…</div>;

  return (
    <>
      <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-2">
        {/* Header with Avatar */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-800 h-40 rounded-lg">
          <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 border-4 border-white rounded-full overflow-hidden bg-white shadow-lg">
            <img
              src={user.profilePicture || defaultImage}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Two Card Layout */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Card — Account Info */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Info</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Role:</span>
                <span>{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Password:</span>
                <span>********</span>
              </div>
            </div>
          </div>

          {/* Right Card — Edit Profile */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>
               
              </div>

              
              {/* Shipping Address */}
              <hr className="my-4" />
              <h3 className="text-lg font-semibold">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(form.shippingAddress).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1 font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={`shippingAddress.${key}`}
                      value={value}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors[`shippingAddress.${key}`] && (
                      <p className="text-red-600 text-sm">
                        {errors[`shippingAddress.${key}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Seller Details */}
              {user.role === 'seller' && (
                <>
                  <hr className="my-4" />
                  <h3 className="text-lg font-semibold">Shop Details</h3>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">Shop Name</label>
                    <input
                      name="shopName"
                      value={form.shopName}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                    {errors.shopName && (
                      <p className="text-red-600 text-sm">{errors.shopName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(form.shopAddress).map(([key, value]) => (
                      <div key={key}>
                        <label className="block mb-1 font-medium text-gray-700">
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        <input
                          name={`shopAddress.${key}`}
                          value={value}
                          onChange={handleChange}
                          className="w-full border rounded px-3 py-2"
                        />
                        {errors[`shopAddress.${key}`] && (
                          <p className="text-red-600 text-sm">
                            {errors[`shopAddress.${key}`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                >
                  Refresh
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 font-semibold rounded-md text-white ${
                    isLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AlertModal
        show={alertModalOpen}
        onClose={handleModalConfirm}
      >
        {alertMessage}
      </AlertModal>
    </>
  );
}

export default ProfilePage;
