import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./components/Profile";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
const routes = [
  {
    path: "/",
    element: <Home/>
  },
   {
    path: "/cart",
    element: <Cart/>
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
  path: "/wishlist",
  element: <Wishlist />,
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>

  },
  {
        path: "forgot-password",
        element: <ForgotPassword />
  },
  {
        path: "reset-password/:token", 
        element: <ResetPassword />
  },
  {
        path: "/profile", 
        element: <Profile />
  },
  {
    path:"/seller/dashboard",
    element:<SellerDashboard/>
  },
  {
    path:"/admin/dashboard",
    element:<AdminDashboard/>
  }
]

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

function App() {
  return <Provider store={store}>
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
    >
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  </Provider>
}

export default App