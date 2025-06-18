// socket.js
let socket = null;

export function setSocket() {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    const url = `wss://4ezciypcy8.execute-api.us-east-1.amazonaws.com/dev/`;
    socket = new WebSocket(url);

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

export function getSocket() {
  return socket;
}
