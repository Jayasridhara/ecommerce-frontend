import protectedInstance from "../instance/protectedInstance";

export async function apiGetCart() {
  const res = await protectedInstance.get('/cart');
  return res.data; // { cart }
}

export async function apiAddToCart(productId, qty = 1) {
  const res = await protectedInstance.post('/cart/add', { productId, qty });
  return res.data;
}

export async function apiRemoveFromCart(productId) {
  const res = await protectedInstance.post('/cart/remove', { productId });
  return res.data;
}

export async function apiUpdateCartQty(productId, qty) {
  const res = await protectedInstance.post('/cart/update', { productId, qty });
  return res.data;
}

export async function apiClearCart() {
  const res = await protectedInstance.post('/cart/clear');
  return res.data; // { cart }
}

