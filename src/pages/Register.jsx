import { toast } from "react-toastify";
import { registerUser } from "../Services/authServices";
import { useState } from "react";
import { Link, useNavigate,  } from "react-router";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer", // default role
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

        const nameRegex = /^[A-Za-z\s]{5,}$/;
      if (!nameRegex.test(formData.name)) {
        toast.error("Name must be at least 5 characters long and contain only letters");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      const password = formData.password;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        );
        return;
      }
    setLoading(true);

    try {
      const userData = { ...formData };
      const response = await registerUser(userData);
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans px-4">
      {/* Logo / Header */}
      <Link
        to="/"
        className="flex items-center gap-4 mb-8 group cursor-pointer select-none"
      >
        <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-6 h-6 text-blue-600" /> {/* Only visible on mobile */}
              <span className="font-extrabold text-xl text-gray-800">ShopVerse</span>
            </motion.div>
      </Link>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Create your account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign up to start selling or shopping
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/90"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/90"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white/90"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 bg-white/90"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:text-pink-500">
            Sign In
          </Link>
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-10">
        © 2025 ShopVerse — All rights reserved
      </footer>
    </section>
  );
};

export default Register;
