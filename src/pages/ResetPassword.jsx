import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';  // ensure correct router import
import instance from '../instance/instance';
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const [tokenCheckLoading, setTokenCheckLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                setIsValidToken(true);
            } catch (err) {
                setError('Invalid or expired password reset link. Please request a new one.');
                setIsValidToken(false);
            } finally {
                setTokenCheckLoading(false);
            }
        };
        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const res = await instance.post(`/auth/resetpassword/${token}`, { password });
            setMessage(res.data.message);
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (tokenCheckLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] px-4">
              <div className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full h-12 w-12" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] px-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
                  <h2 className="mb-4 text-2xl font-semibold text-red-600">Invalid Link</h2>
                  <p className="text-gray-700 mb-2">{error || 'This password reset link is invalid or has expired.'}</p>
                  <p className="text-blue-600"><Link to="/forgot-password">Request a new password reset link</Link></p>
                </div>
            </div>
        );
    }

    return (
        <>
          {/* Logo Link */}
          <div className="flex justify-center mt-6 mb-6">
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

          <div className="flex justify-center items-start min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900">Reset Password</h2>
              <p className="text-center text-gray-500 mb-6">Enter your new password below.</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500">
                    <span className="px-3 text-gray-500">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                      className="w-full py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none rounded-r-md"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:border-blue-500">
                    <span className="px-3 text-gray-500">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
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
                      <span className="animate-spin inline-block mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" role="status" aria-hidden="true"></span>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt mr-2"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
    );
};

export default ResetPassword;
