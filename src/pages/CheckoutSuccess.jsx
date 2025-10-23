import { useEffect, useState } from "react";
import protectedInstance from "../instance/protectedInstance";
import { useNavigate, useSearchParams } from "react-router";
import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import { fetchCart } from "../redux/cartSlice";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) dispatch(setUser(user));

    dispatch(fetchCart())

  }, [user, dispatch]);

  useEffect(() => {
    if (!sessionId) {     
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await protectedInstance.get(
          `/payments/session/${encodeURIComponent(sessionId)}`
        );
        setSession(res.data);
      } catch (err) {
        console.error("Failed to fetch session", err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to fetch session"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);
    console.log("session",session)
  // 🌀 Loading UI
  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-500 text-lg font-medium">
            Verifying your payment...
          </div>
        </div>
      </>
    );

  // ❌ Error UI
  if (error)
    return (
      <>
        <Navbar />
        <PaymentStatusCard
          status="failed"
          title="Payment Verification Failed"
          message={error}
          navigate={navigate}
        />
      </>
    );

  const paymentStatus = session.payment_status || session.status;
  const customerEmail =
    session.customer_details?.email || session.customer_email;
  const amountTotal = session.amount_total ?? session.total_details?.amount ?? 0;
  const lineItems = session.line_items?.data ?? [];

  // ❌ Payment Failed
  if (paymentStatus === "failed") {
    return (
      <>
        <Navbar />
        <PaymentStatusCard
          status="failed"
          title="Payment Failed"
          message="Unfortunately, your payment could not be completed. Please try again or contact support."
          navigate={navigate}
        />
      </>
    );
  }

  // ⏳ Payment Pending
  if (paymentStatus === "unpaid" || paymentStatus === "pending") {
    return (
      <>
        <Navbar />
        <PaymentStatusCard
          status="pending"
          title="Payment Pending"
          message="Your payment is still being processed. We'll notify you once it's confirmed."
          navigate={navigate}
        />
      </>
    );
  }

  // ✅ Successful Payment
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <FiCheckCircle className="text-green-500 text-6xl mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-500 mb-4">
              Thank you! Your payment has been confirmed.
            </p>
            {customerEmail && (
              <p className="text-sm text-gray-500 mb-4">
                Receipt sent to{" "}
                <span className="font-medium">{customerEmail}</span>
              </p>
            )}
            <p className="text-lg font-semibold mb-6">
              Total Paid: ₹{(amountTotal / 100).toFixed(2)}
            </p>
          </div>

          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Order Summary
          </h3>
          <div className="divide-y">
            {lineItems.length === 0 && (
              <p className="text-sm text-gray-500">No items found.</p>
            )}
            {lineItems.map((li) => (
              <div key={li.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {li.description || "Product"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Qty: {li.quantity}
                  </div>
                </div>
                <div className="font-semibold">
                  ₹
                  {(
                    (li.amount_total ??
                      li.price?.unit_amount * li.quantity) / 100
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="px-5 py-2.5 bg-green-600 text-white rounded-full font-medium shadow hover:bg-green-700 transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** ✅ Reusable Payment Status Card Component */
function PaymentStatusCard({ status, title, message, navigate }) {
  const icons = {
    failed: <FiXCircle className="text-red-500 text-6xl mb-3" />,
    pending: <FiClock className="text-yellow-500 text-6xl mb-3" />,
  };
  const colors = {
    failed: "text-red-600",
    pending: "text-yellow-600",
  };
  const bgColors = {
    failed: "bg-red-50",
    pending: "bg-yellow-50",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgColors[status]} px-4`}
    >
      <div className="max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {icons[status]}
        <h2 className={`text-2xl font-bold mb-2 ${colors[status]}`}>{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
          >
            Go Home
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
          >
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
}
