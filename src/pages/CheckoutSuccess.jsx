import { useEffect, useState } from "react";
import protectedInstance from "../instance/protectedInstance";
import { useNavigate, useSearchParams } from "react-router";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      setError("No session id provided");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await protectedInstance.get(`/payments/session/${encodeURIComponent(sessionId)}`);
        setSession(res.data);
      } catch (err) {
        console.error("Failed to fetch session", err);
        setError(err?.response?.data?.message || err.message || "Failed to fetch session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <div className="p-8 text-center">Loading payment details...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Payment verification failed</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-600 text-white rounded">Go home</button>
    </div>
  );

  // session available
  const customerEmail = session.customer_details?.email || session.customer_email;
  const paymentStatus = session.payment_status;
  const amountTotal = (session.amount_total ?? session.total_details?.amount) || null;
  const lineItems = session.line_items?.data ?? [];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Thank you — payment {paymentStatus}</h1>
        {customerEmail && <p className="text-sm text-gray-600 mb-4">Receipt sent to: {customerEmail}</p>}
        {amountTotal != null && (
          <p className="text-lg font-semibold mb-4">Total: ${(amountTotal / 100).toFixed(2)}</p>
        )}

        <h3 className="font-semibold mb-2">Order summary</h3>
        <div className="divide-y">
          {lineItems.length === 0 && <p className="text-sm text-gray-500">No items found.</p>}
          {lineItems.map((li) => (
            <div key={li.id} className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{li.description || li.price?.product?.name || li.price?.product?.metadata?.name}</div>
                <div className="text-sm text-gray-500">Qty: {li.quantity}</div>
              </div>
              <div className="font-semibold">${((li.amount_total ?? (li.price?.unit_amount * li.quantity)) / 100).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={() => navigate("/orders")} className="px-4 py-2 bg-green-600 text-white rounded">View orders</button>
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-gray-200 rounded">Continue shopping</button>
        </div>
      </div>
    </div>
  );
}