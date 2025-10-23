import axios from 'axios';
import { useState } from 'react';
import instance from '../instance/instance';
import { Link } from 'react-router';            // ensure correct router import
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        

        try {
            const res = await instance.post(`auth/forgotpassword`, { email });
            console.log(res)
            setMessage(res.data.message);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
          {/* Logo Link */}
          <div className="flex justify-center my-6">
            <Link to="/" className="flex items-center space-x-3 no-underline">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <span className="font-extrabold text-xl text-gray-800">ShopVerse</span>
              </motion.div>
            </Link>
          </div>

          {/* Card Container */}
          <div className="flex justify-center items-start min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900">Forgot Password</h2>
              <p className="text-center text-gray-500 mb-6">
                Enter your email address and we’ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500">
                    <span className="px-3 text-gray-500">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none rounded-r-md"
                    />
                  </div>
                </div>

                {message && (
                  <div className="mb-4 text-green-700 bg-green-100 border border-green-200 rounded p-3 text-sm">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="mb-4 text-red-700 bg-red-100 border border-red-200 rounded p-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
    );
};

export default ForgotPassword;
