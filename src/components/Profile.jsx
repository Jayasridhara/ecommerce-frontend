
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, setLoading, setError } from '../redux/authSlice';
import { useState } from 'react';
import { useEffect } from 'react';
import protectedInstance from '../instance/protectedInstance';
import defaultImage from "../assets/avatar-character.jpg";  
import Navbar from './Navbar';
function ProfilePageTailwind() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    profilePicture: '',
  });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      const resp = await protectedInstance.put('/auth/profile', form);
      console.log('resp',resp)
      const updated = resp.data.user;
      console.log('updated',updated)
      dispatch(updateUser(updated));
      setSuccessMsg('Profile updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!user) {
    return <div className="text-center py-20">Loading profile…</div>;
  }

  return (
    <>
    <Navbar/>
     <div className="max-w-3xl mx-auto px-4 py-2">
   
      {/* Banner + Avatar */}
      <div className="relative h-30 bg-gradient-to-br from-indigo-500 to-blue-800 rounded-lg">
        <div className="absolute bottom-0 left-8 transform translate-y-1/2 w-28 h-28 border-4 border-white rounded-full overflow-hidden bg-white">
         <img
            src={ user.profilePicture || defaultImage }
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mt-16 flex flex-col md:flex-row gap-6">
        {/* Read-only section */}
        <div className="bg-white rounded-lg shadow-md flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <div className="space-y-3">
            <div className="flex">
              <span className="w-32 font-medium text-gray-600">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium text-gray-600">Role:</span>
              <span className="text-gray-800">{user.role}</span>
            </div>
            <div className="flex">
              <span className="w-32 font-medium text-gray-600">Password:</span>
              <span className="text-gray-800">••••••••</span>
            </div>
          </div>
        </div>

        {/* Edit section */}
        <div className="bg-white rounded-lg shadow-md flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          {error && (
            <div className="mb-4 text-red-600 font-medium">{error}</div>
          )}
          {successMsg && (
            <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Profile Picture URL
              </label>
              <input
                type="text"
                name="profilePicture"
                value={form.profilePicture}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-right mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 font-semibold rounded-md text-white ${
                  isLoading
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
   
  );
}

export default ProfilePageTailwind;
