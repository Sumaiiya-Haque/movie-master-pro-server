const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())




app.get("/", (req, res) => {
  res.send("server is running")
})
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.unwug6n.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const db = client.db('movie-master-db')


  const   movieCollection = db.collection('movies')
  const  userCollection = db.collection('users')

    app.get('/movies', async (req, res) => {
      try {
        const { genre, min, max } = req.query;
        const query = {};

      
        if (genre) {
  query.genre = { $regex: genre, $options: "i" };
}

        if (min || max) {
          query.rating = {};
          if (min) query.rating.$gte = parseFloat(min);
          if (max) query.rating.$lte = parseFloat(max);
        }

        const movies = await movieCollection.find(query).toArray();
        res.send(movies);
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    app.post("/register", async (req, res) => {
      try {
        const user = req.body;
        const existing = await userCollection.findOne({ email: user.email });
        if (existing) {
          return res.status(400).send({ message: "User already registered" });
        }

        const result = await userCollection.insertOne(user);
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    app.get("/users/count", async (req, res) => {
      try {
        const totalUsers = await userCollection.countDocuments();
        res.send({ totalUsers });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get user count" });
      }
    });

    app.get('/movies', async (req, res) => {
      const result = await movieCollection.find().toArray()
      res.send(result)
    })

    app.get('/movies/:id', async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id)
      const result = await movieCollection.findOne({ _id: objectId })
      res.send({ success: true, result })
    })

    app.post("/movies", async (req, res) => {
      const data = req.body;
      if (!data.addedBy) {
        return res.status(400).send({ message: "Email is required" });
      }

      const result = await movieCollection.insertOne(data);
      res.send({ success: true, result });
    });

    app.get("/my-collections", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ message: "Email is required" });

      const query = { addedBy: email };
      const result = await movieCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/movies/:email", async (req, res) => {
      const email = req.params.email;

      if (!email) {
        return res.status(400).send({ message: "Email required" });
      }

      const query = { addedBy: email };
      const result = await movieCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/movies/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedMovie = req.body;

        const result = await movieCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedMovie }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: "Movie updated successfully!" });
        } else {
          res.status(404).send({ success: false, message: "No movie found to update." });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error!" });
      }
    });

    app.delete("/movies/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await movieCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
          res.send({ success: true, message: "Movie deleted successfully!" });
        } else {
          res.status(404).send({ success: false, message: "No movie found to delete." });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error!" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Connected to MongoDB!");

  } finally {}
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})























