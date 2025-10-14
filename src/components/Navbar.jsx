import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, Search, PlusCircle, Home as HomeIcon,Heart  } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setIsSeller } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearWishlist, fetchWishlist } from "../redux/wishlistSlice"; // <-- added

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, isSeller, token } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );

  // compute wishlist count robustly (flatten and ignore falsy)
  const wishlistCount = useSelector((state) => {
    const items = state.wishlist.items || [];
    const flat = items.reduce((acc, cur) => {
      if (Array.isArray(cur)) return acc.concat(cur.filter(Boolean));
      if (cur) acc.push(cur);
      return acc;
    }, []);
    return flat.length;
  });

  useEffect(() => {
    // fetch wishlist whenever user logs in or user id changes
    if (isAuthenticated && user?.id) {
      dispatch(fetchWishlist({ userId: user.id }));

    } else {
      // clear local wishlist when logged out
      // optional: dispatch(clearWishlist());
      
    }
  }, [isAuthenticated, user?.id, token, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
  dispatch(clearUser());
  dispatch(setIsSeller(false));
  dispatch(clearCart());        // clear cart items
  dispatch(clearWishlist());    // clear wishlist items
  navigate("/", { replace: true });
  };

  const onHomeClick = () => {
    navigate("/");
  };

  const isSellerPage = location.pathname.startsWith("/seller");

  return (
    <nav className="bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo or Home icon */}
        <div className="flex items-center gap-3">
        
           <Link to="/" className="flex items-center gap-2">
            {/* Motion wrapper for logo and title */}
            <motion.div
              className="flex items-center gap-2 text-2xl font-extrabold tracking-wide text-white drop-shadow-md text-decoration-none"
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <ShoppingCart className="w-6 h-6 text-white cursor-pointer" />
              </motion.div>
              <motion.span
                whileHover={{ scale: 1.05, x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                ShopVerse
              </motion.span>
            </motion.div>
          </Link>
         
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {/* Search */}
        

          {/* If seller -> show Create Product (smaller button) */}
          {isAuthenticated && user?.role === "seller" && isSeller && !isSellerPage && (
            <button
              onClick={() => navigate("/seller")}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/30 hover:from-pink-400 hover:to-purple-500 transition-all duration-200 hover:scale-105 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Product</span>
            </button>
          )}

          {!isSellerPage && (
              wishlistCount > 0 ? (
                location.pathname.startsWith("/wishlist") ? (
                  <div
                    className="relative opacity-60 pointer-events-none"
                    aria-current="page"
                    title="Wishlist"
                  >
                    <Heart className="w-6 h-6 text-pink-300" />
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-xs px-2 rounded-full">
                      {wishlistCount}
                    </span>
                  </div>
                ) : (
                  <Link to="/wishlist" className="relative hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 text-pink-400 cursor-pointer" />
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-xs px-2 rounded-full">
                      {wishlistCount}
                    </span>
                  </Link>
                )
              ) : (
                <div
                  className="relative opacity-50 cursor-not-allowed"
                  title="Your wishlist is empty"
                >
                  <Heart className="w-6 h-6 text-pink-300" />
                </div>
              )
            )}

            {/* Cart */}
            {!isSellerPage && (
              cartCount > 0 ? (
                location.pathname.startsWith("/cart") ? (
                  <div className="relative opacity-60 pointer-events-none" title="Cart">
                    <ShoppingCart className="w-6 h-6 text-green-400" />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 rounded-full">
                      {cartCount}
                    </span>
                  </div>
                ) : (
                  <Link to="/cart" className="relative hover:scale-105 transition-transform">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-2 rounded-full">
                      {cartCount}
                    </span>
                  </Link>
                )
              ) : (
                <div
                  className="relative opacity-50 cursor-not-allowed"
                  title="Your cart is empty"
                >
                  <ShoppingCart className="w-6 h-6 text-green-400" />
                </div>
              )
            )}

          {/* Auth / Profile */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-white font-semibold text-lg hover:text-orange-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <span className="w-11 h-11 bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center text-2xl font-extrabold border-2 border-white/70 shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fadeIn">
                  <div className="py-4 px-4 flex flex-col gap-2">
                    <span className="text-center text-lg font-bold text-indigo-700 mb-1">
                      {user?.name}
                    </span>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gradient-to-r hover:from-indigo-100 hover:to-orange-100 transition text-decroration-none"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 rounded-lg text-red-600 font-medium hover:bg-gradient-to-r hover:from-pink-100 hover:to-orange-100 transition"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white hover:text-orange-200 focus:outline-none"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg
              className="w-8 h-8"
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

      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.22s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-12px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </nav>
  );
}
