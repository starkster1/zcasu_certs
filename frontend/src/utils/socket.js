import { io } from 'socket.io-client';

// Replace 'http://localhost:5000' with your backend WebSocket server URL
const SOCKET_URL = 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'], // Ensure WebSocket is the primary transport
  reconnection: true, // Automatically attempt reconnections
});

export default socket;
