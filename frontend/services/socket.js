import { io } from "socket.io-client";

const socket = io("https://smart-food-waste-management-system-2.onrender.com");

export default socket;