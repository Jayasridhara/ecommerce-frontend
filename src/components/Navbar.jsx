import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ShoppingCart, Search, PlusCircle, Home as HomeIcon,Heart  } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setIsSeller } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice";

export default function Navbar() {
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, isSeller } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );

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
        
            <Link to="/" className="text-2xl font-extrabold tracking-wide text-white drop-shadow-md">
              ShopVerse
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
          <Link to="/wishlist" className="relative hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-pink-400 cursor-pointer" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-xs px-2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
        )}
          {/* Cart (hide on seller page, disable if empty) */}
          {!isSellerPage && (
            <Link
              to={cartCount > 0 ? "/cart" : "#"}
              className={`relative hover:scale-105 transition-transform ${cartCount === 0 ? "pointer-events-none opacity-50" : ""}`}
            >
              <ShoppingCart className="w-6 h-6 text-purple-300 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
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
                <span className="w-11 h-11 bg-white/40 backdrop-blur-md text-indigo-700 rounded-full flex items-center justify-center text-2xl font-extrabold border-2 border-white/70 shadow-lg">
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
                      className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gradient-to-r hover:from-indigo-100 hover:to-orange-100 transition"
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
