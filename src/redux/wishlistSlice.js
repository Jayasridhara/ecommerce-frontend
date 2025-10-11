import { createSlice } from "@reduxjs/toolkit";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../Services/wishlistServices";

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
        const payload = action.payload;
        // Normalize all possible payload shapes to a flat array of products
        let newItems = [];
        if (Array.isArray(payload)) {
          newItems = payload;
        } else if (payload && Array.isArray(payload.wishlist)) {
          newItems = payload.wishlist;
        } else if (payload && (payload._id || payload.id)) {
          // merge single product object, avoid duplicates by _id or id
          const idKey = payload._id ? "_id" : "id";
          const exists = state.items.find((p) => String(p._id || p.id) === String(payload[idKey]));
          if (!exists) state.items.push(payload);
          return;
        } else {
          // unknown payload -> keep existing
          return;
        }
        // dedupe by _id (or id fallback)
        const map = new Map();
        newItems.forEach((p) => {
          if (!p) return;
          const key = String(p._id ?? p.id ?? p);
          if (!map.has(key)) map.set(key, p);
        });
        state.items = Array.from(map.values());
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        // If server returned the full updated wishlist array
        if (Array.isArray(payload)) {
          state.items = payload;
          return;
        }
        if (payload && Array.isArray(payload.wishlist)) {
          state.items = payload.wishlist;
          return;
        }
        // If payload contains the removed id or product object
        const removedId = payload && (payload.productId || payload._id || payload.id);
        if (removedId) {
          state.items = state.items.filter((p) => String(p._id ?? p.id) !== String(removedId));
          return;
        }
        // fallback: do nothing (keep state)
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // Fetch Wishlist (NEW)
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        // normalize payload to flat array
        let items = [];
        if (Array.isArray(payload)) items = payload;
        else if (payload && Array.isArray(payload.wishlist)) items = payload.wishlist;
        else items = [];

        // dedupe and remove falsy
        const map = new Map();
        items.forEach((p) => {
          if (!p) return;
          const key = String(p._id ?? p.id ?? p);
          if (!map.has(key)) map.set(key, p);
        });
        state.items = Array.from(map.values());
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export { addToWishlist, removeFromWishlist, fetchWishlist };
export default wishlistSlice.reducer;
