import { redirect } from "react-router";
// import { clearUser, setUser } from "../redux/authSlice";
import { getMe } from "../Services/authServices";
// import store from "../redux/store";

const authLoader = async () => {
    try {
        const response = await getMe();
        // Update Redux state with authenticated user
        // store.dispatch(setUser(response));
        return response;
    } catch (error) {
        console.error('Auth loader error:', error);
        // Clear authentication state on error
        // store.dispatch(clearUser());
        return redirect('/login');
    }
}

export default authLoader;