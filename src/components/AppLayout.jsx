import { Outlet, useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function AppLayout() {
  const loaderData = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaderData && loaderData.user) {
      dispatch(setUser(loaderData));
    } else if (!location.pathname.startsWith("/")) { 
      dispatch(clearUser());
    }
  }, [loaderData, dispatch]);

  return (
    <>
   
      <Outlet />
      <footer className="text-center py-6 border-t border-gray-200 text-gray-500 text-sm bg-white">
        © 2025 ShopVerse — All Rights Reserved
      </footer>
    </>
  );
}