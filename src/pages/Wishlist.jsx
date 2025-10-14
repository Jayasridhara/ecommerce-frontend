import { removeFromWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

import { Trash2, ShoppingCart } from "lucide-react";

import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AlertModal from "./AlertModal";

export default function Wishlist() {
  const items = useSelector((state) => state.wishlist.items || []);
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) {
      setShowEmptyAlert(true);
      const t = setTimeout(() => {
        setShowEmptyAlert(false);
        navigate("/");
      }, 3000);
      return () => clearTimeout(t);
    } else {
      setShowEmptyAlert(false);
    }
  }, [items, navigate]);

  const handleAlertClose = () => {
    setShowEmptyAlert(false);
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-pink-400">
          Your Wishlist ❤️
        </h1>

        {!items || items.length === 0 ? (
          <p className="text-center text-gray-400">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((p) => (
              <div
                key={p._id}
                className="bg-purple-800/70 p-4 rounded-xl shadow-md text-center hover:shadow-purple-600 transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                />
                <h4 className="font-semibold text-purple-100 mb-1">{p.name}</h4>
                <p className="text-gray-300">${p.price || 'N/A'}</p>
                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => dispatch(addToCart(p))}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist({ userId: user.id, productId: p._id }))}
                    className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AlertModal
        show={showEmptyAlert}
        onClose={handleAlertClose}
      >
        Your wishlist is empty. Redirecting to home...
      </AlertModal>
    </div>
  );
}
