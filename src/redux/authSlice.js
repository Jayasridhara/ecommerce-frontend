import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));
if (storedUser && storedUser._id && !storedUser.id) {
  storedUser.id = storedUser._id; // normalize on load
}

const storedisAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
const storedisSeller = JSON.parse(localStorage.getItem("isSeller"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    isAuthenticated: storedisAuthenticated || false,
    isLoading: false,
    error: null,
    isSeller: storedisSeller || false,
  },
  reducers: {
    setUser: (state, action) => {
      const user = action.payload || {};
      // Normalize id
      if (user._id && !user.id) user.id = user._id;

      state.user = user;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("isSeller", JSON.stringify(user.role === "seller"));
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSeller = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("isSeller");
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    updateUser: (state, action) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...action.payload };
        if (updatedUser._id && !updatedUser.id) updatedUser.id = updatedUser._id;

        state.user = updatedUser;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        localStorage.setItem("isSeller", JSON.stringify(updatedUser.role === "seller"));
      }
    },

    setIsSeller: (state, action) => {
      state.isSeller = action.payload;
      localStorage.setItem("isSeller", JSON.stringify(action.payload));
    },
  },
});

export const { setUser, clearUser, setLoading, setError, updateUser, setIsSeller } = authSlice.actions;
export default authSlice.reducer;
