import { Link, useNavigate } from "react-router";
import { clearUser, setIsSeller, setSwitcher } from "../redux/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSeller = useSelector((state) => state.auth.isSeller);
  const isSwitched = useSelector((state) => state.auth.isSellerSwitched);
console.log(isSeller);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      dispatch(setIsSeller(false));
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      dispatch(clearUser());
      toast.error("Error during logout, but session cleared");
      navigate("/login", { replace: true });
    }
  };

  const handleSwitchToBuyer = () => {
    if (!isSwitched) {
      dispatch(setSwitcher(true));
      toast.info("Switched to Buyer Dashboard");
      navigate("/dashboard");
    } else {
      dispatch(setSwitcher(false));
      toast.info("Switched to Seller Dashboard");
      navigate("/seller/dashboard");
    }
  };

  // ...existing code...
return (
  <nav className="bg-gradient-to-tr from-indigo-700 via-fuchsia-600 to-orange-400 shadow-xl">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center shadow-lg border-2 border-white/60">
            <span className="text-3xl font-extrabold text-white drop-shadow-lg tracking-widest">X</span>
          </div>
          <span className="text-2xl font-black text-white tracking-wider drop-shadow-lg hidden sm:inline">Cart</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
         
          {isAuthenticated && isSeller && isSwitched && (user?.role !== "buyer") && (
            <Link
              to="/seller/dashboard"
              className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-200"
            >
              Seller Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === "seller" && isSeller && (
            <button
              onClick={handleSwitchToBuyer}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
            >
              {isSwitched ? "Switch to Buyer" : "Switch to Seller"}
            </button>
          )}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-white font-semibold text-lg hover:text-orange-200 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-pink-500 hover:to-pink-700 transition-all duration-200"
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
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fadeIn">
                  <div className="py-4 px-4 flex flex-col gap-2">
                    <span className="text-center text-lg font-bold text-indigo-700 mb-1">{user?.name}</span>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white hover:text-orange-200 focus:outline-none"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border z-50 animate-fadeIn">
          <div className="flex flex-col gap-1 py-4 px-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-indigo-100 hover:to-orange-100 transition"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && isSeller && isSwitched && (user?.role !== "buyer") && (
              <Link
                to="/seller/dashboard"
                className="px-4 py-2 rounded-lg text-green-700 font-semibold hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 transition"
                onClick={() => setMobileOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === "seller" && isSeller && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSwitchToBuyer();
                }}
                className="px-4 py-2 rounded-lg text-yellow-700 font-semibold hover:bg-gradient-to-r hover:from-yellow-100 hover:to-yellow-200 text-left transition"
              >
                {isSwitched ? "Switch to Buyer" : "Switch to Seller"}
              </button>
            )}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-indigo-100 hover:to-orange-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-pink-700 font-semibold hover:bg-gradient-to-r hover:from-pink-100 hover:to-orange-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-indigo-100 hover:to-orange-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 rounded-lg text-red-600 font-semibold hover:bg-gradient-to-r hover:from-pink-100 hover:to-orange-100 transition"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    {/* Animation for dropdown */}
    <style>
      {`
        .animate-fadeIn {
          animation: fadeIn 0.22s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-12px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}
    </style>
  </nav>
);
// ...existing code...
};

export default Navbar;