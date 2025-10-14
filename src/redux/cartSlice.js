import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
      else state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCart: (state, action) => {
      const cart = action.payload || {};
      state.items = (cart.cartItems || []).map((ci) => {
        const p = ci.product || {};
        return {
          id: p._id ?? p.id ?? String(ci.product),
          _id: p._id ?? p.id ?? String(ci.product),
          name: p.name ?? ci.name,
          image: p.image ?? ci.image,
          price: Number(ci.price ?? p.price ?? 0),
          qty: Number(ci.qty ?? 0),
        };
      });
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
