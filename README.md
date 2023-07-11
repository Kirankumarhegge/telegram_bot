# telegram_bot
Website which broadcast the messages of user on the server side

## Table of contents
* [General info](#general-info)
* [File Setup](#file-setup)
* [Screenshots](#screenshots)
* [How to use](#how-to-use)
* [Code example](#code-example)

## Genral info
This project focuses on receiving different message types from users, such as text, images, videos, and PDF files, 
through a Telegram bot. Using the npm-telegram-bot-api package, we extract and process these messages, ensuring 
they are handled in the order they are received. To maintain the sequence, I have utilize an array data structure as a 
message queue, allowing us to process messages sequentially. This approach ensures that user interactions are handled 
in the intended order, maintaining the flow of conversations.

## File setup
I have divided files mainly into two file that is webSocket and server
where you can see db for handling the add query and get query, telegramHandler where it handles the incoming messages to the bot.
File messageQueue is to handle incoming messages in the queue and adding it into the db as well as broadcasting it to serverside.
server file is the main file where server is created, connection is made to db and telegramHanler is invoked. 

1. WebSocket:
* Handles WebSocket connections.
* Contains the WebSocket server code.
* Responsible for sending/receiving messages over WebSocket.

2. Server:
* Handles server-related functionality.
* Establishes a connection to the database.
* Invokes the TelegramHandler to handle incoming messages from the bot.

3. Additional files in server:
* DB: Handles database operations such as adding and retrieving data.
* TelegramHandler: Handles incoming messages from the Telegram bot.
* MessageQueue: Manages the queue of incoming messages, adds messages to the database, and broadcasts them to the server-side.

```
-- server
   /db
     -- query
   /telegramHandler
     -- botMsgHandler
   -- messageQueue
   -- server
-- webSocket
   -- ws
```

## Screenshots
Here is one screenshot below of three diffrent users sending messages to the bot.
User have sent all types of messages i.e text, image, video and pdf shown below
<img width="720" alt="Screenshot 2023-07-12 at 1 49 48 AM" src="https://github.com/Kirankumarhegge/telegram_bot/assets/86415401/30cab206-ca5c-4026-b9bb-a4f891ec0c35">

As you can see the messages are displayed on the server side. These messages contain message with user name and message sent time.
You cannot see image, video and pdf but you can download it to view it.
<img width="720" alt="Screenshot 2023-07-11 at 11 29 41 PM" src="https://github.com/Kirankumarhegge/telegram_bot/assets/86415401/27da3435-4409-4f3f-87f2-e00df145e7f2">
<img width="720" alt="Screenshot 2023-07-11 at 11 30 12 PM" src="https://github.com/Kirankumarhegge/telegram_bot/assets/86415401/3c72a4a3-0a7f-42f7-8007-1d6534bf123c">

This is the screenshot of database
<img width="720" alt="Screenshot 2023-07-12 at 12 04 32 AM" src="https://github.com/Kirankumarhegge/telegram_bot/assets/86415401/b7db1197-06c4-4094-8cff-fe0f432d3557">


## How to use
To clone and run this application you will need Git and Node.js (which comes with npm) installed on your computer.


Clone this Repository
```
$ git clone
```

Open Terminal
```
$ cd server
$ npm i axios express dotenv mongodb node-telegram-bot-api
```

Open another terminal
```
$ cd client
$ npm i ws
```
Create a file named .env
```
TOKEN=TELEGRAM_BOT_TOKEN
DBSTRING=DATABASE_STRING
```

To run this project use this in both the terminal
```
$ npm start
```

## Code example
This function starts the server and listens on port 3000. 
Also create server, connects to mongoDB, invoke telegrambot, processQueue
```
const server = app.listen(3000, () => {
  initSocketServer(server);
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
```

To extract the message from the telegram which user sent
```
bot.on('message', (message) => {
    console.log(message)
});
```

To make coonect to db
```
async function connectToDB() {
  const client = new MongoClient(DATABASE_STRING);
  await client.connect();
  db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
}
```

The server listens for incoming messages and adds them to an array acting as a queue. 
Each message is also stored in the database with relevant attributes. Messages are processed in the order they were 
received by taking the first message from the queue if there are multiple messages present.
```
function processQueue(message) {
  if (message) {
    messageQueue.push(message);
  }
  if (messageQueue.length > 0) {
    const message = messageQueue.shift();
    broadcastMessage(message);
  }
}
```



