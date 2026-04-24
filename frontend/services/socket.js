import { io } from "socket.io-client";

// Derive socket URL from API URL (removing /api/ suffix if present)
const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/";
const socketURL = apiURL.replace(/\/api\/?$/, "");

const socket = io(socketURL);

export default socket;
