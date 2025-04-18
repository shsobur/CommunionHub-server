const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;

// middleware__
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4yea9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const eventCollection = client.db("communionHubDB").collection("events");

    // Get all events data__
    app.get("/events", async (req, res) => {
      const result = await eventCollection.find().toArray();
      res.send(result);
    })

    // Get event data by category__

    app.get("/event", async (req, res) => {
      const category = req.query.category;
      const query = {category: category};
      const result = await eventCollection.find(query).toArray();
      res.send(result);
    })

    // Post event data__

    app.post("/new-event", async (req, res) => {
      const eventData = req.body;
      console.log(eventData);
      const result = await eventCollection.insertOne(eventData);
      res.send(result);
    })























    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Commuion Hub server is runing");
});

app.listen(port, () => {
  console.log(`Communion Hub server is runing on ${port}`);
});
