// lib/socket.js
let socket;

export function getSocket() {
  if (!socket) {
    socket = new WebSocket("wss://eowjhroeoj.execute-api.us-east-1.amazonaws.com/dev/");

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
      socket = null;
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  return socket;
}
