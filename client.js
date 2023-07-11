const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:3000/ws'); // Replace with the appropriate server URL

// this get trigger whenever the msg is sent from the server
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received message:', message);
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
