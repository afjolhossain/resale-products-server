// furnitureDb name
// ehBhbGWfdjPEVDtk password

const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvuwn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client
      .db("productServices")
      .collection("products");
    const reviewCollection = client.db("customerReview").collection("review");
    const bookingCollection = client.db("customerReview").collection("booking");
    const updateCollection = client
      .db("customerProfile")
      .collection("profileUpdate");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      return res.send(products);
    });

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // review Coustomer
    //  API Post
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // API get
    app.get("/review", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      return res.send(review);
    });

    // booking POST Api
    app.post("/booking", async (req, res) => {
      const bookings = req.body;
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });

    // Get My bookings Items Using By Email

    app.get("/booking", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = await bookingCollection.find(query);
      const booking = await cursor.toArray();
      res.send(booking);
    });

    // Booking Delete Api
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // ProfileUpdate API Post

    app.post("/profileUpdate", async (req, res) => {
      const Profiles = req.body;
      const result = await updateCollection.insertOne(Profiles);
      res.send(result);
    });

    app.get("/profileUpdate", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = await updateCollection.find(query);
      const updateProfile = await cursor.toArray();
      res.send(updateProfile);
    });

    // ProfileUpdate API get
    app.get("/profileUpdate", async (req, res) => {
      const query = {};
      const cursor = updateCollection.find(query);
      const profile = await cursor.toArray();
      return res.send(profile);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Resale furniture server is running");
});

app.listen(port, () => console.log(`Resale furniture running on ${port}`));
