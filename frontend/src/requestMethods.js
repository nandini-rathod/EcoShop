import axios from "axios";

const BASE_URL = "https://ecoshop-xoeh.onrender.com";

// Read token dynamically on each request so it works after login without page reload
const getToken = () => {
  try {
    const persist = localStorage.getItem("persist:root");
    if (!persist) return null;
    const user = JSON.parse(JSON.parse(persist).user);
    return user?.currentUser?.accessToken || null;
  } catch {
    return null;
  }
};

export const publicRequest = axios.create({ baseURL: BASE_URL });

export const userRequest = axios.create({ baseURL: BASE_URL });

// Attach token dynamically on every userRequest
userRequest.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers["token"] = `Bearer ${token}`;
  return config;
});
