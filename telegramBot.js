require('dotenv').config();
const { TOKEN } = process.env;
const TelegramBot = require('node-telegram-bot-api');
const { addMessageToDB } = require('./query');
const { processQueue } = require('./messageQueue');

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (message) => {
  // console.log(message)
  const timestamp = message.date;
  // The given timestamp of the Telegram bot is in seconds
  // So here the timestamp is converted into milliseconds
  const date = new Date(timestamp * 1000);
  const time = date.toLocaleTimeString();
  if (message.text) {
    // Handle text messages

    const telegramMessage = {
      text: message.text,
      from: {
        id: message.from.id,
        username: message.from.first_name + " " + message.from.last_name,
        sentTime: time
      },
    };
    processQueue(telegramMessage);
    addMessageToDB(telegramMessage);
  } 
  else if (message.photo) {
    // Handles photo 
    // console.log("Coming into Photo Message")
    const photo = message.photo[0]; // Get the first photo in the array
    const photoId = photo.file_id;
    const telegramMessage = {
      photoId: photoId,
      from: {
        id: message.from.id,
        username: message.from.first_name + " " + message.from.last_name,
        sentTime: time
      },
    };

    processQueue(telegramMessage);
    addMessageToDB(telegramMessage);
  } 
  else if (message.video) {
      // Handles videos 
      // console.log("Coming into video Message")
      const video = message.video;
      const videoId = video.thumbnail.file_id;
      const telegramMessage = {
        videoId: videoId,
        from: {
          id: message.from.id,
          username: message.from.first_name + " " + message.from.last_name,
          sentTime: time
        },
      };

    processQueue(telegramMessage);
    addMessageToDB(telegramMessage);
  }
  else if (message.document) {
    // Handles documents 
    // console.log("Coming into doc Message")
    const document = message.document;
    const documentId = document.thumbnail.file_id;
    const documentName = document.file_name;
    const telegramMessage = {
      documentId: documentId,
      from: {
        id: message.from.id,
        documentName: documentName,
        username: message.from.first_name + " " + message.from.last_name,
        sentTime: time
      },
    };

    processQueue(telegramMessage);
    addMessageToDB(telegramMessage);
  }
});

function startTelegramBot() {
  console.log('Telegram bot started');
}

module.exports = {
  startTelegramBot,
};
