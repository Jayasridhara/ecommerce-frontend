import protectedInstance from "../instance/protectedInstance";


export async function createCheckoutSession(items,userId,orderId) {
  const payload = {
    items,
    userId,
    orderId,
    successUrl: `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/cart`,
  };

  const res = await protectedInstance.post("/payments/create-checkout-session", payload);
  return res.data; // expect { sessionId } or { url } depending on your backend
}