import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart, setCart } from "../redux/cartSlice";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";
import AlertModal from "./AlertModal";
import { createCheckoutSession } from "../Services/paymentService";
import Navbar from "../components/Navbar";
import { apiClearCart, apiGetCart, apiRemoveFromCart, apiUpdateCartQty } from "../Services/cartServices";
import protectedInstance from "../instance/protectedInstance";
import { getMe } from "../Services/authServices";
import ShippingAddressModal from "../components/ShippingAddressModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function Cart() {
const { items } = useSelector((state) => state.cart);
const {user} = useSelector((state) =>  state.auth);

const dispatch = useDispatch();
const navigate = useNavigate();
const [showAlert, setShowAlert] = useState(false);
const [showAddressModal, setShowAddressModal] = useState(false);
const [checkoutLoading, setCheckoutLoading] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);
const [message,setMessage]=useState("");
console.log("items",items)
// 👇 Watch for when cart becomes empty
useEffect(() => {
  if (items.length === 0) {
    setMessage("Your cart is Empty")
  setShowAlert(true);

}

}, [items]);
useEffect(() => {
  (async () => {
  try {
  const res = await apiGetCart();
  dispatch(setCart(res.cart));

} catch (err) {
  console.error("fetch cart failed", err);
}
})();
}, [dispatch]);

 
const handleCheckout = async () => {
  if (items.length === 0) return;
 try {
  setCheckoutLoading(true);
  const userData = await getMe();
  console.log("Fetched user data:", userData);
  const addr = userData.shippingAddress || {};
  console.log("User shipping address:", addr);
  const requiredFields = [
  "fullName",
  "addressLine1",
  "city",
  "state",
  "postalCode",
  "country",
  "phone",
  ];

  const missing = requiredFields.filter(
  (f) => !addr[f] || addr[f].trim() === ""
  );

  if (missing.length > 0) {
    toast.info("Please complete your shipping address before checkout.");
    setShowAddressModal(true);
    setCheckoutLoading(false);
    return;
  }
  const cartRes = await protectedInstance.get("/cart");
  console.log("cart response", cartRes);
  const orderId = cartRes.data?.cart?._id;
  const payloadItems = items.map((i) => ({
  id: i._id ?? i.id,
  name: i.name,
  image: i.image,
  qty: i.qty || 1,
  price: i.price.toFixed(2),
  seller:{
  id: i.seller?.id || null,
  name: i.seller?.name || null,
  email: i.seller?.email || null, 
  status: i.seller?.status || 'cart',
  }      
  }));
 
  const data = await createCheckoutSession(payloadItems,user?._id,orderId);
  console.log("checkout response", data);

  if (data.url) {
  window.location.href = data.url;
  return;
  }

  if (data.sessionId && data.publishableKey) {
  const stripe = await loadStripe(data.publishableKey);
  if (!stripe) throw new Error("Failed to initialize Stripe");
  const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  if (error) throw error;
  return;
  }
  toast.success("Address verified. Proceeding to checkout...");
  throw new Error("Invalid checkout response from server");
  } catch (err) {
  console.error("Checkout failed", err);
  } finally {
  setCheckoutLoading(false);
  }
};

const handleClearCart = async () => {
try {
const res = await apiClearCart();
dispatch(setCart(res.cart.cartItems));
 setMessage("Clear the cart");
setShowAlert(true);
} catch (err) {
console.error("Clear cart failed", err);
 setMessage("⚠️ Failed to clear cart, but local cart was reset.");
dispatch(clearCart());
}
};

console.log(message);
const handleCloseAlert = () => {
setShowAlert(false);
navigate("/");
};

// Update quantity on server (if qty becomes 0 server removes the item)
const handleUpdateQty = async (productId, newQty) => {
try {
const res = await apiUpdateCartQty(productId, newQty);
dispatch(setCart(res.cart.cartItems));
} catch (err) {
console.error("Update qty failed", err);
}
};

const handleRemoveRequest = (productId) => {
  setProductToDelete(productId);
  setShowDeleteModal(true);
};

const confirmRemove = async () => {
  try {
    if (productToDelete) {
      const res = await apiRemoveFromCart(productToDelete);
      dispatch(setCart(res.cart.cartItems));
      toast.success("Item removed from cart.");
    }
  } catch (err) {
    console.error("Remove from cart failed", err);
    toast.error("Failed to remove item.");
  } finally {
    setShowDeleteModal(false);
    setProductToDelete(null);
  }
};


const handleRemove = async (productId) => {
try {
const res = await apiRemoveFromCart(productId);
dispatch(setCart(res.cart.cartItems));
} catch (err) {
console.error("Remove from cart failed", err);
}
};

const total = items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

return (
<>
    <Navbar />
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
    key={item._id}
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
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={async () => {
            const pid = item.id ?? item._id;
            const next = (Number(item.qty) || 0) - 1;
            if (next <= 0) {
              await handleRemove(pid);
            } else {
              await handleUpdateQty(pid, next);
            }
          }}
          className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer"
        >
          <Minus className="w-4 h-4 text-gray-700 " />
        </button>
        <span className="px-3 text-lg font-semibold">{item.qty}</span>
        <button
          onClick={async () => {
            const pid = item.id ?? item._id;
            const next = (Number(item.qty) || 0) + 1;
            console.log("Checking stock:", item.stock, "for product", pid);
              if (next > item.stock) {
              toast.error("Cannot add more. Stock limit reached! 📦");
              return;
            }
            await handleUpdateQty(pid, next);
          }}
            className={`bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-700 cursor-pointer"`}
        >
          <Plus className="w-4 h-4 text-gray-700 cursor-pointer" />
        </button>
      </div>
    </div>
    </div>

    {/* Right Section — Price + Remove */}
    <div
    className="flex items-center gap-4 mt-3 sm:mt-0"
    onClick={(e) => e.stopPropagation()}
    >
    <p className="text-lg font-bold text-purple-600">
      ${item.price.toFixed(2)}
    </p>
    <button
      onClick={(e) => {
        e.stopPropagation();
        const pid = item.id ?? item._id;
        handleRemoveRequest(pid);
      }}
      className="bg-pink-500 hover:bg-pink-400 p-2 rounded-full cursor-pointer"
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

    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
    <button
    onClick={handleClearCart}
    className="bg-purple-500 hover:bg-purple-400 px-6 py-2 rounded-lg cursor-pointer"
    >
    Clear Cart
    </button>

    <button
    onClick={handleCheckout}
    disabled={checkoutLoading}
    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
    >
    {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
    </button>

    </div>
    </motion.div>
    )}

    <ShippingAddressModal
    show={showAddressModal}
    onClose={() => setShowAddressModal(false)}
    onSave={handleCheckout}
    />
    <AlertModal show={showAlert} onClose={handleCloseAlert} >{message}</AlertModal>
    <ConfirmDeleteModal
    show={showDeleteModal}
    onCancel={() => setShowDeleteModal(false)}
    onConfirm={confirmRemove}
    message="Are you sure you want to remove this item from your cart?"
  /> 
    </div>
</>
);
}
