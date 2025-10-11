import { Outlet, useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import { useEffect } from "react";

export default function AppLayout() {
  const loaderData = useLoaderData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaderData && loaderData.user) {
      dispatch(setUser(loaderData));
    } else {
      dispatch(clearUser());
    }
  }, [loaderData, dispatch]);

  return <Outlet />;
}