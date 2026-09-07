import axios from "axios";
import { setAccessToken, setUser } from "../auth.slice.js";
import { store } from "../../../app/app.store.js";

const api = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true, // refresh cookie auto bhejega
});

// Jab bhi koi request jaayegi, ye function chalega
api.interceptors.request.use((config) => {
   const token = store.getState().auth.accessToken; // Redux se
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config; // request ko aage bhejna zaroori hai
});
/**
 * Ab jahan bhi tum api.get(...) ya api.post(...) karoge, token automatically header mein chala jayega. Isse tumhe har jagah manually headers: { Authorization: ... } nahi likhna padega.
 */
// Now Response interceptor — 401 pe refresh karna
api.interceptors.response.use(
   // agar response theek hai, kuch mat karo
   (res) => res,

   // agar response mein error hai, ye chalega
   async (err) => {
      const originalRequest = err.config;

      // sirf 401 pe hi refresh try karo, aur ek hi baar
      if (err.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true; // dobara retry na ho, infinite loop se bachne ke liye

         try {
            // refresh token cookie se naya access token maango
            const { data } = await axios.get(
               "http://localhost:3000/api/auth/refresh-token",
               {},
               { withCredentials: true },
            );

            // naya token save karo
            store.dispatch(setAccessToken(data.accessToken));

            // purani request ka header update karo naye token se
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            // purani request dobara bhejo
            return api(originalRequest);
         } catch (refreshErr) {
            // refresh bhi fail ho gaya matlab login expire — logout kar do
            store.dispatch(setUser(null));
            // window.location.href = "/login";
            return Promise.reject(refreshErr)
         }
      }

      return Promise.reject(err);
   },
);

export async function register({ username, email, password }) {
   const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
   });
   return response.data;
}

export async function login({ email, password }) {
   const response = await api.post("/api/auth/login", {
      email,
      password,
   });
   return response.data;
}

export async function refreshToken() {
   const response = await api.get("/api/auth/refresh-token");
   return response.data;
}

export async function getMe() {
   const response = await api.get("/api/auth/get-me");
   return response.data;
}

export async function logout() {
   const response = await api.post("/api/auth/logout");
   return response.data;
}

export async function logoutAll() {
   const response = await api.post("/api/auth/logout-all");
   return response.data;
}

export default api;
