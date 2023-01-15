require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =  `${process.env.MONGODB_CONNECTION}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect()
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch(err => {
  console.log(err);
});

module.exports = client;