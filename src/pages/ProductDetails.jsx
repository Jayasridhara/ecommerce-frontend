
import { addToCart } from "../redux/cartSlice";
import data from "../Dataset/product";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { Heart, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Hooks must always be called — never conditionally
  const { items: wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ UseMemo ensures we don’t recompute on every render
  const product = useMemo(
    () => data.find((p) => p.id === parseInt(id)),
    [id]
  );

  const [rating, setRating] = useState(product?.rating || 4.5);

  const isInWishlist = product ? wishlist.some((p) => p.id === product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-purple-900 via-purple-800 to-black">
        Product not found.
      </div>
    );
  }

  const handleWishlist = () => {
    if (!isAuthenticated) {
      alert("Please log in to use the wishlist ❤️");
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleRating = (value) => {
    if (!isAuthenticated) {
      alert("Please log in to rate ⭐");
      return;
    }
    setRating(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white font-sans">
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
          <h2 className="text-3xl font-bold text-purple-200 mb-4">{product.name}</h2>
          <p className="text-xl text-pink-400 font-semibold mb-2">${product.price.toFixed(2)}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => handleRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-300">{rating.toFixed(1)}★</span>
          </div>

          <p className="text-gray-300 mb-2">
            <span className="text-purple-300">Color:</span> {product.color}
          </p>
          <p className="text-gray-300 mb-4">
            <span className="text-purple-300">Category:</span> {product.productType}
          </p>

          <p className="text-gray-400 mb-6 leading-relaxed">
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
              onClick={() => alert("Proceeding to checkout...")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 text-sm text-gray-400 hover:text-white underline"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}