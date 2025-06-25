// src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  withCredentials: true, // ถ้ามี cookie auth
});

export default socket;