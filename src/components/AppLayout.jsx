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
    </>
  );
}