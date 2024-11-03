import axios from "axios";
import { deleteCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("API base URL is not configured");
}

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("auth_token");
    }
    return Promise.reject(error);
  }
);

export default api;
