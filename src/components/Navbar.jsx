import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, Heart, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setIsSeller } from "../redux/authSlice";
import { clearCart, fetchCart } from "../redux/cartSlice";
import { clearWishlist, fetchWishlist } from "../redux/wishlistSlice";
import { getMyOrders } from "../Services/orderServices";
import { use } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const profileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const hideNavIcons = currentPath === "/checkout-success";
  const { isAuthenticated, user, isSeller, token } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.length || 0);
  const wishlistCount = useSelector((state) => state.wishlist.items.length || 0);
  const [orders, setOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
const [warningShown, setWarningShown] = useState(false);
  useEffect(() => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return;

  const updateTime = () => {
    const diff = Number(tokenExpiry) - Date.now();

    // Session expired → auto logout
    if (diff <= 0) {
      handleLogout();
      return;
    }

    // If less than 1 min left, show timer
    if (diff <= 60 * 1000) {
      setShowTimer(true);
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s < 10 ? "0" + s : s}s`);

      if (!warningShown) {
        toast.warn("⚠️ Your session will expire in 1 minute. Please save your work or re-login soon!")
        alert("⚠️ Your session will expire in 1 minute. Please save your work or re-login soon!");
        setWarningShown(true);
      }
    } else {
      setShowTimer(false);
    }
  };

  updateTime();
  const timer = setInterval(updateTime, 1000);
  return () => clearInterval(timer);
}, [warningShown]);

  console.log("user",user)
  useEffect(() => {
    if (isAuthenticated)
       dispatch(fetchCart());
    else dispatch(clearCart());
  }, [isAuthenticated, user?.id, token]);

  useEffect(() => {
    if (isAuthenticated && user?.id) dispatch(fetchWishlist({ userId: user.id }));
    else dispatch(clearWishlist());
  }, [isAuthenticated, user?.id, token]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const data = await getMyOrders(); // Ensure getMyOrders is defined and available
          setOrders(data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(setIsSeller(false));
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/", { replace: true });
  };

  const isSellerPage = location.pathname.startsWith("/seller");

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        
        {/* Top Row: Logo + Hamburger + Icons */}
        <div className="flex justify-between items-center w-full md:w-auto gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-6 h-6 text-blue-600 " /> {/* Only visible on mobile */}
              <span className="font-extrabold text-xl text-gray-800">ShopVerse</span>
            </motion.div>
          </Link>

          {/* Mobile Icons: Heart & Cart */}
          <div className="flex items-center gap-3 md:hidden">
            { !hideNavIcons && (
             <Link
              to={wishlistCount > 0 ? "/wishlist" : "#"}
              className={`relative ${
                wishlistCount === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:scale-105 transition-transform"
              }`}
            >
              <Heart className="w-6 h-6 text-pink-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            )}
            {/* Cart Icon */}
            { !hideNavIcons && (
            <Link
              to={cartCount > 0 ? "/cart" : "#"}
              className={`relative ${
                cartCount === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "hover:scale-105 transition-transform"
              }`}
            >
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && user?.role === "seller" && isSeller && !isSellerPage && (
            <button
              onClick={() => navigate("/seller")}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-blue-600 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New Product
            </button>
          )}

          {!hideNavIcons && isAuthenticated && location.pathname !== "/orders" && (
            orders.length > 0 ? (
              <Link
                to="/orders"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all text-decroration-none no-underline"
              >
                My Orders
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-500 font-medium cursor-not-allowed no-underline"
              >
                My Orders
              </button>
            )
          )}

          {/* Wishlist Icon */}
          {!isSellerPage && !hideNavIcons && (
            <Link
              to="/wishlist"
              className={`relative hover:scale-105 transition-transform
                ${wishlistCount === 0 || location.pathname.startsWith("/wishlist") ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
              `}
            >
              <Heart
                className={`w-6 h-6 ${
                  location.pathname.startsWith("/wishlist") ? "text-pink-500" : "text-gray-700"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart Icon */}
          {!hideNavIcons && !isSellerPage && (
            <Link
              to="/cart"
              className={`relative hover:scale-105 transition-transform
                ${cartCount === 0 || location.pathname.startsWith("/cart") ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
              `}
            >
              <ShoppingCart
                className={`w-6 h-6 ${
                  location.pathname.startsWith("/cart") ? "text-blue-600" : "text-gray-700"
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition no-underline">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-600 transition no-underline">
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {showTimer && (
                  <span className="text-xs text-gray-500 ml-2">
                    ⏳ {timeLeft} left
                  </span>
                )}
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border border-blue-300">
                  {user?.name?.charAt(0).toUpperCase()}
                 
                </span>
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-center">
                  <div className="px-4 py-2 text-gray-700 font-semibold border-b border-gray-100 ">
                      <p className="font-semibold">{user?.name}</p>
              <        p className="text-sm text-gray-500">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 transition no-underline"
                  > 
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full  px-4 py-2 text-red-500 hover:bg-red-50 transition text-center"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
      {mobileMenuOpen && (
    <div className="md:hidden absolute right-0 mt-6 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 flex flex-col gap-3 z-50">
      {!isAuthenticated ? (
        <>
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 no-underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-center hover:bg-gray-300 no-underline"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {/* Show username and role first */}
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-center">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>

            {/* Profile link - hide if already on /profile */}
            {currentPath !== "/profile" && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-center hover:bg-gray-200  text-decoration-none"
              >
                Profile
              </Link>
            )}

            {isAuthenticated && user?.role === "seller" && isSeller && !isSellerPage && (
              <button
                onClick={() => {
                  navigate("/seller");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold"
              >
                <PlusCircle className="w-4 h-4" /> New Product
              </button>
            )}

            {/* My Orders link - hide if already on /orders */}
            {!hideNavIcons && currentPath !== "/orders" &&  isAuthenticated &&(
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg text-center no-underline ${
                  orders.length > 0
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                My Orders
              </Link>
            )}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
)}

      </div>
    </nav>
  );
}
