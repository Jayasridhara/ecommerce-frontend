import { createAsyncThunk } from "@reduxjs/toolkit";
import protectedInstance from "../instance/protectedInstance";

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.post("wishlist/add", { userId, productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.post("wishlist/remove", { userId, productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
