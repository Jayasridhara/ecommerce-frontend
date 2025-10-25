import { addToCart, fetchCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { Heart, Star } from "lucide-react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertModal from "./AlertModal";
import { addOrUpdateReview} from "../Services/productServices";
import { apiAddToCart, apiGetCart, apiRemoveFromCart, apiUpdateCartQty } from "../Services/cartServices";
import { setCart } from "../redux/cartSlice";   
import { getMe } from "../Services/authServices";
import { createCheckoutSession } from "../Services/paymentService";
import { loadStripe } from "@stripe/stripe-js";
import ShippingAddressModal from "../components/ShippingAddressModal";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loaderData = useLoaderData();
  const { product: initialProduct, reviews: initialReviews } = loaderData;
 const { items } = useSelector((state) => state.cart);
  const { items: wishlist } = useSelector((state) => state.wishlist);
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
 
  
  
  

const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(initialProduct);
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(initialProduct.rating || 0);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  
  const reviewTextareaRef = useRef(null);
  // normalize wishlist (flat array of product objects or id strings)
  const sanitizedWishlist = Array.isArray(wishlist)
    ? wishlist.flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))
    : [];
  const isInWishlist = product
    ? sanitizedWishlist.some((p) => {
        if (!p) return false;
        if (typeof p === "object" && (p._id || p.id)) return String(p._id ?? p.id) === String(product._id);
        return String(p) === String(product._id);
      })
    : false;
console.log("Current product:", product);
console.log(wishlist,wishlist)
console.log("Is in wishlist:", isInWishlist);

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setModalMessage("Please log in to use the wishlist ❤️");
      setShowModal(true);
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist({ userId: user.id, productId: product._id }));
       toast.warn("Remove from wishlist")
    } else {
      dispatch(addToWishlist({ userId: user.id, productId: product._id }));
       toast.success("Add to wishlist sucessfully")
    }
  };

      const handleRating = (value) => {
      if (!isAuthenticated) {
        setModalMessage("Please log in to rate ⭐");
        setShowModal(true);
        return;
      }

      setRating(value);

      // 🧠 Show alert to guide user to write review
      toast.success("Now write your review below 💬");

      // 🕒 Slight delay to ensure modal appears before focusing
      setTimeout(() => {
        if (reviewTextareaRef.current) {
          reviewTextareaRef.current.focus();
        }
      }, 400);
    };


  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      setModalMessage("Please log in to post a review 💬");
      setShowModal(true);
      return;
    }
    if (!rating || comment.trim() === "") {
      setModalMessage("Please add both rating and comment ⭐💬");
      setShowModal(true);
      return;
    }
    try {
      const res = await addOrUpdateReview(product._id, { rating, comment }, token);
      // update state from response
      setProduct(res.product);
      setReviews(res.product.reviews || []);
      setRating(res.product.rating || rating);
      setModalMessage("Review submitted successfully ✅");
      setShowModal(true);
      setComment("");
    } catch (err) {
      setModalMessage("Error submitting review ❌");
      setShowModal(true);
      console.error(err);
    }
  };
  useEffect(() => {
    (async () => {
    try {
      const currentqty=items.filter((item)=>item.id==product._id)
      if(currentqty.length>0)
        setQuantity(currentqty[0].qty);
      
      
  } catch (err) {
    console.error("fetch cart failed", err);
  }
  })();
  }, [dispatch]);

  console.log("Quantity",quantity)
  
 
  // ✅ function to proceed to checkout
  const proceedToCheckout = async (addr) => {
    setModalMessage("Preparing checkout...");
    setShowModal(true);
  
    const payloadItems = [
      {
        id: product._id,
        name: product.name,
        image: product.image,
        qty: quantity,
        price: (product.price * quantity).toFixed(2),
        seller: {
          id: product.seller?.id || null,
          name: product.seller?.name || null,
          email: product.seller?.email || null,
          status: "cart",
        },
      },
    ];

    const orderId = product._id + "-buynow-" + Date.now();
    const data = await createCheckoutSession(payloadItems, user._id, orderId,isBuyNow);

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    if (data.sessionId && data.publishableKey) {
      const stripe = await loadStripe(data.publishableKey);
      if (!stripe) throw new Error("Failed to initialize Stripe");
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) throw error;
      return;
    }

    throw new Error("Invalid checkout response from server");
  };

  const handleUpdateQty = async (productId, newQty) => {
    try {
        const isalreadyincart=items.some((item)=>item.id==productId)
        if(!isalreadyincart){
           const res = await apiAddToCart(productId, newQty);
         dispatch(setCart(res.cart.cartItems));
          toast.success("Add to cart successfully")
        }
        else
        {
        
          const res = await apiUpdateCartQty(productId, newQty);
          dispatch(setCart(res.cart.cartItems));
          toast.success("This product already exist in the cart Quantity increased")
        }

      setQuantity(newQty);
      
    } catch (err) {
      console.error("Update qty failed", err);
      toast.error("Failed to update quantity ❌");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white text-gray-800 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-10  items-center">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl shadow-lg"
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
            ${ (product.price * quantity).toFixed(2) }
            <span className="text-sm text-gray-500 ml-2">
              (${product.price.toFixed(2)} each)
            </span>
          </p>

          {/* ⭐ Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => handleRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">{rating.toFixed(1)}★</span>
          </div>

          <p className="text-gray-700 mb-2">
            <span className="text-purple-700">Color:</span> {product.color}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="text-purple-700">Category:</span> {product.productType}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="text-purple-700">Stock:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">{product.stock} available</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description ||
              "This product blends modern design with top performance."}
          </p>
          {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-purple-700 font-semibold">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            {/* Decrease Button */}
             <button
              onClick={() => {
                if (quantity > 1) {
                  const newQty = quantity - 1;
                  setQuantity(newQty);
                  handleUpdateQty(product._id, newQty);
                }
              }}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold cursor-pointer"
            >
              −
            </button>

            {/* Quantity Display */}
            <span className="px-4 text-lg font-medium">{quantity}</span>

            {/* Increase Button */}
            <button
              onClick={() => {
                
                if (quantity < product.stock) {
                  const newQty = quantity + 1;
                  handleUpdateQty(product._id, newQty);
                  
                } else {
                  toast.error("You have reached the maximum stock available 📦");
                }
              }}
              className="px-3 py-1 text-lg font-bold bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-4">
        {product.stock <= 0 ? (
          // 🟥 Out of Stock Button
          <button
            onClick={() => {
              setModalMessage("This product is currently out of stock 🚫");
              setShowModal(true);
            }}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold cursor-not-allowed "
          >
            Out of Stock
          </button>
        ) : (
          <>
            {/* 🛒 Add to Cart */}
            <button
              onClick={async () => {
                if (!isAuthenticated) {
                  setModalMessage("Please log in to add to cart");
                  setShowModal(true);
                  return;
                }
                try {
                     const isalreadyincart=items.some((item)=>item.id==product._id)
                      if(isalreadyincart)
                      {
                          toast.success("Product already exist quantity increased")
                      }
                      else
                      {
                        toast.success("Product added to cart")
                      }
                       const res = await apiAddToCart(product._id, 1);
                        dispatch(setCart(res.cart.cartItems));
                        dispatch(fetchCart());
                        
                
                } catch (err) {
                  console.error("add to cart error", err);
                }
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 rounded-lg font-semibold hover:opacity-90 cursor-pointer"
            >
              Add to Cart
            </button>

            {/* 💳 Buy Now */}
            <button
               onClick={async () => {
                if (!isAuthenticated) {
                  setModalMessage("Please log in to add to cart");
                  setShowModal(true);
                  return;
                }
                try {
                  const isalreadyincart=items.some((item)=>item.id==product._id)
                  if(!isalreadyincart){
                      const res = await apiAddToCart(product._id, quantity);
                      dispatch(setCart(res.cart.cartItems));
                      dispatch(fetchCart());
                    }
                    else
                    {

                      const resq = await apiRemoveFromCart(product._id);
                      dispatch(setCart(resq.cart.cartItems));
                      const res = await apiAddToCart(product._id, quantity);
                      dispatch(setCart(res.cart.cartItems));
                      dispatch(fetchCart());
                    }
                  navigate("/cart");
                } catch (err) {
                  console.error("add to cart error", err);
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded-lg font-semibold hover:opacity-90 cursor-pointer"
            >
              Buy Now
            </button>
          </>
        )}
      </div>

        </div>
      </div>

      {/* Review Section */}
      <div className="max-w-3xl mx-auto px-6 mt-12 mb-20">
        <h3 className="text-2xl font-semibold text-purple-800 mb-4">Customer Reviews</h3>

        {/* Review Form */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <Star
                key={val}
                onClick={() => handleRating(val)}
                className={`w-6 h-6 cursor-pointer ${
                  val <= rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            ref={reviewTextareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            rows="3"
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 cursor-pointer"
          >
            Submit Review
          </button>
        </div>

        {/* Review List */}
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-purple-700">{r.user?.name}</span>
                <span className="text-sm text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <Star
                    key={v}
                    className={`w-4 h-4 ${
                      v <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        )}
      </div>

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
       <ShippingAddressModal
        show={showShippingModal}
        existingData={userAddress}
        onClose={() => setShowShippingModal(false)}
        onSave={async () => {
          setShowShippingModal(false);
          const updatedUser = await getMe();
          await proceedToCheckout(updatedUser.shippingAddress);
        }}
      />
    </div>
  );
}