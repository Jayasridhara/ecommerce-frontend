import protectedInstance from "../instance/protectedInstance";


export async function createCheckoutSession(items, { orderId, userId } = {}) {
  const payload = {
    items,
    successUrl: `${window.location.origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/cart`,
    // optional: include orderId / userId to ensure metadata populated on server
    ...(orderId ? { orderId } : {}),
    ...(userId ? { providedUserId: userId } : {}), // <-- ADDED: send providedUserId to backend
    
  };

  // debug log to confirm payload
  console.debug('createCheckoutSession payload', payload);

  const res = await protectedInstance.post("/payments/create-checkout-session", payload);
  return res.data; // expect { sessionId, url }
}