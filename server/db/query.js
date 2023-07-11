const { MongoClient } = require('mongodb');
require('dotenv').config();
const { DBSTRING } = process.env;

const connectionString = DBSTRING;
const dbName = 'Cluster0';
const collectionName = 'BroadCast Messages';

let collection, db;

// this function connects to db
async function connectToDB() {
  const client = new MongoClient(connectionString);
  await client.connect();
  db = client.db(dbName);
  collection = db.collection(collectionName);
}

// to add msg to db
async function addMessageToDB(message) {
    try {
      const collection = db.collection(collectionName);
      await collection.insertOne(message);
      console.log('Message inserted into the database');
    } catch (error) {
      console.error('Failed to insert message into the database:', error);
    }
  }


async function getAllMessagesFromDB() {
  return await collection.find().toArray();
}

module.exports = {
  connectToDB,
  addMessageToDB,
  getAllMessagesFromDB,
};
