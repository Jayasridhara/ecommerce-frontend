import protectedInstance from "../instance/protectedInstance";


export async function createCheckoutSession(items,userId,orderId,isBuyNow) {
  const token = localStorage.getItem('token');  // <-- retrieve token
  if (!token) {
    throw new Error('User not authenticated: token missing');
  }
  const payload = {
    items,
    userId,
    orderId,
    isBuyNow,
    successUrl: `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/cart`,
    headers: { Authorization: `Bearer ${token}`}
  };
  console.log("createCheckoutSession payload:", payload);
  const res = await protectedInstance.post("/payments/create-checkout-session", payload);
  return res.data; // expect { sessionId } or { url } depending on your backend
}