import { createSlice } from "@reduxjs/toolkit";
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedisAuthenticated= JSON.parse(localStorage.getItem("isAuthenticated"));
const storedisSeller = JSON.parse(localStorage.getItem("isSeller"));
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: storedUser || null,
        isAuthenticated:storedisAuthenticated || false,
        isLoading: false,
        error: null,
        isSeller: storedisSeller||false,
        setSwitcher: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
            localStorage.setItem("isSeller", JSON.stringify(action.payload));
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("user"); 
             localStorage.removeItem("token");
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
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user)); 
                localStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
                localStorage.setItem("isSeller", JSON.stringify(action.payload));
            }
        },
        setIsSeller: (state, action) => {
            state.isSeller = action.payload;
            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem("isAuthenticated", JSON.stringify(action.payload));
            localStorage.setItem("isSeller", JSON.stringify(action.payload)); 
        },
        setSwitcher: (state, action) => {
            state.isSellerSwitched = action.payload;
        }
    }
})

export const { setUser, clearUser, setLoading, setError, updateUser, setIsSeller, setSwitcher } = authSlice.actions;

export default authSlice.reducer;