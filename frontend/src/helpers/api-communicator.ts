import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV
    ? "/api/v1"
    : "https://mern-ai-chat-bot-six.vercel.app");

// Create a custom axios instance with error handling
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add response interceptor to handle 401 silently for auth-status
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors from auth-status check (expected when not logged in)
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/user/auth-status")
    ) {
      // Suppress logging by returning rejected promise without logging
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email: string, password: string) => {
  const res = await axiosInstance.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axiosInstance.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axiosInstance.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axiosInstance.post("/chat/new", { message });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  const data = await res.data;
  return data;
};

export const getUserChats = async () => {
  const res = await axiosInstance.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to fetch chats");
  }
  const data = await res.data;
  return data;
};

export const deleteUserChats = async () => {
  const res = await axiosInstance.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};
