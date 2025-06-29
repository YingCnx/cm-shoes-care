// src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false, // ✅ ปิด autoConnect
});

// ✅ ฟังก์ชันสำหรับ connect แบบ lazy
export const connectSocket = () => {
  if (!socket.connected) {
    //console.log("🚀 Connecting socket...");
    socket.connect();
  }
};

export default socket;