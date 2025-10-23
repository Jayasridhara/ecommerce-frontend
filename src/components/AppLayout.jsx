import { Outlet, useLoaderData, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";
import { toast } from "react-toastify";
export default function AppLayout() {
  const loaderData = useLoaderData();
  const dispatch = useDispatch();

 const navigate = useNavigate();

  useEffect(() => {
    // ✅ 1. Token expiry check
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
      // Token expired
      dispatch(clearUser());
      toast.warn("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    // ✅ 2. Restore user if still valid
    if (loaderData && loaderData.user) {
      dispatch(setUser(loaderData));
    } else if (!location.pathname.startsWith("/")) {
      dispatch(clearUser());
    }

    // ✅ 3. Setup auto logout when token expires
    if (tokenExpiry) {
      const remainingTime = Number(tokenExpiry) - Date.now();
      const timeout = setTimeout(() => {
        dispatch(clearUser());
        toast.info("Session expired. Please log in again.");
        navigate("/login");
      }, remainingTime);

      return () => clearTimeout(timeout);
    }
  }, [loaderData, dispatch, navigate]);

  return (
    <>
   
      <Outlet />
      <footer className="text-center py-6 border-t border-gray-200 text-gray-500 text-sm bg-white">
        © 2025 ShopVerse — All Rights Reserved
      </footer>
    </>
  );
}