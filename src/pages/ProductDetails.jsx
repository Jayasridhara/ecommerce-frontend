
import { addToCart } from "../redux/cartSlice";
import data from "../Dataset/product";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { Heart, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertModal from "./AlertModal";
import { getProductById } from "../Services/productServices";
import { useEffect } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(4.5);
  const [loading, setLoading] = useState(true);

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.product);
        setRating(res.rating || 4.5);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const isInWishlist = product
    ? wishlist.some((p) => p._id === product._id)
    : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg bg-gradient-to-br from-purple-100 via-pink-50 to-white">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg bg-gradient-to-br from-purple-100 via-pink-50 to-white">
        Product not found.
      </div>
    );
  }

  // ✅ Handle wishlist click
  const handleWishlist = () => {
    if (!isAuthenticated) {
      setModalMessage("Please log in to use the wishlist ❤️");
      setShowModal(true);
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  // ✅ Handle rating click
  const handleRating = (value) => {
    if (!isAuthenticated) {
      setModalMessage("Please log in to rate ⭐");
      setShowModal(true);
      return;
    }
    setRating(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* Product Image with Heart */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
          >
            <Heart
              className={`w-6 h-6 ${
                isInWishlist ? "text-pink-500 fill-pink-500" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-3xl font-bold text-purple-800 mb-4">
            {product.name}
          </h2>
          <p className="text-xl text-pink-600 font-semibold mb-2">
            ${product.price?.toFixed(2)}
          </p>

          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => handleRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">{rating.toFixed(1)}★</span>
          </div>

          <p className="text-gray-700 mb-2">
            <span className="text-purple-700">Color:</span> {product.color}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="text-purple-700">Category:</span>{" "}
            {product.productType}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description ||
              "This product blends modern design with top performance. Ideal for customers who value innovation and style."}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Add to Cart
            </button>
            <button
              onClick={() =>
                setModalMessage("Proceeding to checkout...") || setShowModal(true)
              }
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 text-sm text-gray-400 hover:text-gray underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>

      {/* ✅ Alert Modal */}
      <AlertModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalMessage.includes("log in")) {
            navigate("/login");
          }
        }}
      >
        {modalMessage}
      </AlertModal>
    </div>
  );
}