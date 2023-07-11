const WebSocket = require('ws');
const { getAllMessagesFromDB } = require('./query');

const messageQueue = [];
let socketServer;

function processQueue(message) {
  // Pushes the msg in queue
  if (message) {
    messageQueue.push(message);
  }
  // This pulls out the first msg from the queue
  if (messageQueue.length > 0) {
    const message = messageQueue.shift();
    broadcastMessage(message);
  }
}

function broadcastMessage(message) {
  const messageString = JSON.stringify(message);
  // This is for if more then one user is connect to websocket 
  // then msgs are reflected to user for every refresh
  socketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

function initSocketServer(server) {
  socketServer = new WebSocket.Server({ server });

  socketServer.on('connection', (socket) => {
    getAllMessagesFromDB()
      .then((messages) => {
        socket.send(JSON.stringify(messages));
      })
      .catch((error) => {
        console.error('Failed to load messages from the database:', error);
      });
  });
}

module.exports = {
  processQueue,
  broadcastMessage,
  initSocketServer,
};
