const { connectToDB, getAllMessagesFromDB } = require('./db/query');
const { startTelegramBot } = require('./telegramHandler/botMsgHandler');
const { processQueue, initSocketServer } = require('./messageQueue');
require('dotenv').config();
const { TOKEN } = process.env;
const axios = require('axios');
const express = require('express');
const app = express();
// Create an Express app
app.use(express.json());

// Broadcast port path where all the messages are retrived
app.get('/', async (req, res) => {
    try {
      const messages = await getAllMessagesFromDB();
      console.log(messages)
      const messagesHTML = await generateMessagesHTML(messages);
      res.send(messagesHTML);
    } catch (error) {
      console.error('Failed to fetch collection data:', error);
      res.sendStatus(401);
    }
  });
  
// This Starts the server at 3000
const server = app.listen(3000, () => {
  console.log(`Server is running on localhost 3000`);
  // This creates a new websocket server
  initSocketServer(server);
  //connect to db when server starts
  connectToDB()
    .then(() => {
      console.log('Connected to the database MongoDB: Cluster0');

      startTelegramBot();
      processQueue();
    })
    .catch((error) => {
      console.error('Failed to connect to the database:', error);
    });
});

// Function return the html for the page
async function generateMessagesHTML(messages) {
  let html = `
    <html>
    <head>
      <title>Telegram Broadcast Message </title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: dimgrey;
          padding: 20px 150px 20px;
        }
        
        h1 {
          color: white;
        }
        
        .messages {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
          background-color: silver;
        }
        
        .message {
          margin-bottom: 5px;
          padding: 2px 20px 2px;
          background-color: white;
          border-radius: 8px;
        }
        
        .message-text {
          font-weight: bold;
        }
        
        .message-from {
          color: 	gray;
        }
        
        .message-time {
          color: 	gray;
          font-size: 0.8em;
        }

        .download {
          font-size: 0.8em;
        }
      </style>
    </head>
    <body>
      <h1>Telegram Broadcast Messages</h1>
      <div class="messages">
  `;
  
  for (const message of messages) {
    if (message.photoId) {
      const photoUrl = await getUrl(message.photoId);
      html += `
      <div class="message">
        <a href="${photoUrl}">
        <img src="https://lumpics.ru/wp-content/uploads/2018/02/CHem-otkryit-img.png" height="100px" width="110px" alt="Photo">
        <p class="download"> Click to Download Image</p>
        </a>
      `;
    }
    else if (message.videoId) {
      const videoUrl = await getUrl(message.videoId);
      html += `
      <div class="message">
        <a href="${videoUrl}">
        <img src="https://freepngimg.com/download/video_icon/30257-7-video-icon-image.png" height="100px" width="110px" alt="Photo">
        <p class="download"> Click to Download Video</p>
        </a>
      `;
    }
    else if (message.documentId){
      const docUrl = await getUrl(message.documentId);
      html += `
      <div class="message">
        <a href="${docUrl}">
        <img src="https://www.kindpng.com/picc/m/33-332806_pdf-icon-hd-png-download.png" height="100px" width="110px" alt="Photo">
        <p class="download">${message.from.documentName}</p>
        <p class="download"> Click to Download PDF</p>
        </a>
      `;
    }
    else if (message.text){
    html += `
      <div class="message">
        <p class="message-text">${message.text}</p>
    `;
    }
    html += `
      <p class="message-from">From: <strong>${message.from.username}</strong></p>
      <p class="message-time">${message.from.sentTime}</p>
    </div>
    `
  }
  
  html += `
      </div>
    </body>
    </html>
  `;
  
  return html;
}

// This function returns the link for the data like photo, video or pdf
async function getUrl(id) {
  const response = await axios.get(`https://api.telegram.org/bot${TOKEN}/getFile?file_id=${id}`);
  const filePath = response.data.result.file_path;
  const url = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
  return url;
}
