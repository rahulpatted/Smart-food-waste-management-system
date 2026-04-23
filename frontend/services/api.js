import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/",
});

if (
  process.env.NEXT_PUBLIC_API_URL === undefined &&
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost"
) {
  console.warn(
    "⚠️ CRITICAL: NEXT_PUBLIC_API_URL is undefined on a non-localhost environment. API calls will likely fail or hang."
  );
}

API.interceptors.request.use((req) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `🌐 [OUTGOING REQUEST] ${req.method?.toUpperCase()} ${req.baseURL || ""}${req.url}`
    );
  }
  return req;
});

export default API;
