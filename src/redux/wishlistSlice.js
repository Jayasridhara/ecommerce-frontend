import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, removeFromWishlist } from "../Services/wishlistServices";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const exists = state.items.find((p) => p.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((p) => p.id !== action.payload.id);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {  clearWishlist } = wishlistSlice.actions;
export { addToWishlist, removeFromWishlist }; 
export default wishlistSlice.reducer;
