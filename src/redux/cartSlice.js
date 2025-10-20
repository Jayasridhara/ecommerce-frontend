import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetCart } from "../Services/cartServices";

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
      const cart = action.payload || [];
      state.items = (cart || []).map((ci) => {
        const p = ci.product || {};
        return {
          id: p._id ?? p.id ?? String(ci.productId),
          _id: p._id ?? p.id ?? String(ci.productId),
          name: p.name ?? ci.name,
          image: p.image ?? ci.image,
          price: Number(ci.price ?? p.price ?? 0),
          qty: Number(ci.qty ?? 0),
          stock: Number(ci.stock ?? p.stock ?? 0),
          salesCount: Number(ci.salesCount ?? p.salesCount ?? 0),
          seller: ci.seller || (p.seller ? {  
            id: p.seller._id ?? p.seller.id ?? String(p.seller),
            name: p.seller.name,
            email: p.seller.email,
          } : { id: null, name: "Unknown", email: ""}),
          status: ci.seller?.status || 'cart',
        };
      });
    },
  },
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { dispatch }) => {
  const { cart } = await apiGetCart();
  console.log("Fetched cart:", cart);
  dispatch(setCart(cart));
  return cart.items;
});

extraReducers: (builder) => {
  builder.addCase(fetchCart.fulfilled, (state, action) => {
    state.items = action.payload;
  });
}
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
