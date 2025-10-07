import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find((p) => p.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist,clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
