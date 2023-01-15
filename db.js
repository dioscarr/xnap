const MongoClient = require('mongodb').MongoClient;
const uri = `${process.env.MONGODB_CONNECTION}`;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = client;