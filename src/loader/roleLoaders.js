

import { clearUser, setUser } from "../redux/authSlice";
import store from "../redux/store";
import { getMe } from "../Services/authServices";
import { redirect } from "react-router";

export const adminLoader = async () => {
    try {
        const response = await getMe();
        const user = response;

        // Update Redux state with authenticated user
        store.dispatch(setUser(user));

        if (user.role !== 'admin') {
            if (user.role === 'user') {
                return redirect('/dashboard');
            } else if (user.role === 'recruiter') {
                return redirect('/recruiter/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('Admin loader error:', error);
        // Clear authentication state on error
        store.dispatch(clearUser());
        return redirect('/login');
    }
}

export const recruiterLoader = async () => {
    try {
        const response = await getMe();
        const user = response;

        // Update Redux state with authenticated user
        store.dispatch(setUser(user));

        if (user.role !== 'recruiter') {
            if (user.role === 'user') {
                return redirect('/dashboard');
            } else if (user.role === 'admin') {
                return redirect('/admin/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('Recruiter loader error:', error);
        // Clear authentication state on error
        store.dispatch(clearUser());
        return redirect('/login');
    }
}

export const userLoader = async () => {
    try {
        const response = await getMe();
        const user = response;

        // Update Redux state with authenticated user
        store.dispatch(setUser(user));

        if (user.role !== 'user') {
            if (user.role === 'recruiter') {
                return redirect('/recruiter/dashboard');
            } else if (user.role === 'admin') {
                return redirect('/admin/dashboard');
            }

            return redirect('/login');
        }

        return response;
    } catch (error) {
        console.error('User loader error:', error);
        // Clear authentication state on error
        store.dispatch(clearUser());
        return redirect('/login');
    }
}