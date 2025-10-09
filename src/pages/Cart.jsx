import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../redux/cartSlice";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
import AlertModal from "./AlertModal";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  // 👇 Watch for when cart becomes empty
  useEffect(() => {
    if (items.length === 0) {
      setShowAlert(true);
    }
  }, [items]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/");
  };

  const total = items
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-purple-600">
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col sm:flex-row items-center justify-between py-4 cursor-pointer hover:bg-purple-50 rounded-lg px-3 transition"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                {/* Left Section — Image + Name */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    {/* 👇 Quantity controls */}
                    <div
                      className="flex items-center gap-3 mt-2"
                      onClick={(e) => e.stopPropagation()} // prevent accidental navigation
                    >
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="px-3 text-lg font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Section — Price + Remove */}
                <div
                  className="flex items-center gap-4 mt-3 sm:mt-0"
                  onClick={(e) => e.stopPropagation()} // avoid accidental route change
                >
                  <p className="text-lg font-bold text-purple-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="bg-pink-500 hover:bg-pink-400 p-2 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-gray-200 pt-4">
            <h2 className="text-xl font-semibold">Total:</h2>
            <p className="text-2xl font-bold text-purple-600">${total}</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleClearCart}
              className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-2 rounded-lg font-semibold"
            >
              Clear Cart
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ✅ Alert Modal */}
      <AlertModal show={showAlert} onClose={handleCloseAlert} />
    </div>
  );
}