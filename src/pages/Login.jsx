import { loginUser } from "../Services/authServices";
import { setUser, setIsSeller } from "../redux/authSlice";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "buyer",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      dispatch(setUser(response.user));
      
      localStorage.setItem("token", response.token);
     const expiryTime = Date.now() + 6 * 60 * 60 * 1000; // 6 hours
    localStorage.setItem("tokenExpiry", expiryTime);
      if (response.user.role !== "buyer") {
        dispatch(setIsSeller(true));
      
      }
      toast.success(response.message);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans px-4">
      {/* Logo / Header */}
      <Link to="/" className="flex items-center space-x-3 mb-6"> 
       <div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-6 h-6 text-blue-600 text-decoration-none" /> {/* Only visible on mobile */}
              <span className="font-extrabold text-xl text-gray-800">ShopVerse</span>
            </div>
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to continue exploring amazing deals
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/90"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white/90"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
           
            <Link
              to="/forgot-password"
              className="text-pink-600 hover:text-pink-500 font-medium no-underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-10 py-3">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:text-pink-500 no-underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>

     
      
    </section>
  );
};

export default Login;
