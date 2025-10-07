import instance from "../instance/instance";
import protectedInstance from "../instance/protectedInstance";


export const registerUser = async (userData) => {
    const response = await instance.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await protectedInstance.post("/auth/login", credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await protectedInstance.get("/auth/getMe");
    return response.data;
};

export const profile = async () => {
    const response = await protectedInstance.put("/auth/profile");
    return response.data;
};

export const logoutUser = async () => {
    const response = await protectedInstance.post("/auth/logout");
    return response.data;
};