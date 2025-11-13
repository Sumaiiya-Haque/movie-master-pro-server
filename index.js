const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


app.get("/", (req, res) => {
  res.send("server is running")
})
console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.unwug6n.mongodb.net/?appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middleware

// const verifyToken = async(req,res,next)=>{
//  const authorization = req.headers.authorization
//  const token = authorization.split(' ')[1]

 
//  try {
//    await admin.auth().verifyIdToken(token)
//     next()
//  } catch (error) {
//   res.status(401).send({
//     message:"unauthorized access"
//   })
//  }

  

// }

async function run() {
  try {
    await client.connect();
    const db = client.db('movie-master-db')
    const movieCollection = db.collection('movies')
  

    // findMany
    // findOne

    // filter


// app.get('/movies', async (req, res) => {
//   try {
//     const { genre, min, max } = req.query;

//     const query = {};

//     // Multiple genre filter
//     if (genre) {
//       const genreArray = genre.split(","); 
//       query.genre = { $in: genreArray };
//     }

//     // Rating range filter
//     if (min || max) {
//       query.rating = {};
//       if (min) query.rating.$gte = parseFloat(min);
//       if (max) query.rating.$lte = parseFloat(max);
//     }

//     const result = await movieCollection.find(query).toArray();
//     res.send(result);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Server error" });
//   }
// });




// GET /movies route
// app.get('/movies', async (req, res) => {
//   try {
//     const { genre, min, max } = req.query;
//     const query = {};

//     // Single genre search using $in + case-insensitive
//     if (genre) {
//       query.genre = { $in: [new RegExp(`^${genre}$`, "i")] };
//     }

//     // Rating filter
//     if (min || max) {
//       query.rating = {};
//       if (min) query.rating.$gte = parseFloat(min);
//       if (max) query.rating.$lte = parseFloat(max);
//     }

//     const movies = await movieCollection.find(query).toArray();
//     res.send(movies);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: "Server error" });
//   }
// });

// eita try kori

app.get('/movies', async (req, res) => {
  try {
    const { genre, min, max } = req.query;
    const query = {};

    // Single genre search (case-insensitive)
    if (genre) {
      query.genre = { $regex: `^${genre}$`, $options: "i" };
    }

    // Rating filter
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






    app.get('/movies', async (req, res) => {
      const result = await movieCollection.find().toArray()
      res.send(result)
    })

    app.get('/movies/:id', async (req, res) => {
      const { id } = req.params;
      console.log(id)
      const objectId = new ObjectId(id)
      const result = await movieCollection.findOne({ _id: objectId })
      res.send({
        success: true,
        result
      })
    })

    //post method
    // insertMany
    // insertOne

    // app.post("/movies", async (req, res) => {
    //   const data = req.body;
    //   console.log(data)
    //   const result = await movieCollection.insertOne(data)
    //   res.send({
    //     success: true,
    //     result
    //   })
    // })
    app.post("/movies", async (req, res) => {
  const data = req.body;

  if (!data.addedBy) {
    return res.status(400).send({ message: "Email is required" });
  }

  const result = await movieCollection.insertOne(data);
  res.send({ success: true, 
    result
   });
});



app.get("/my-collections", async (req, res) => {
  const email = req.query.email; // query parameter

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

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

// 




    //  Update movie by ID
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
          res
            .status(404)
            .send({ success: false, message: "No movie found to update." });
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



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})













// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.unwug6n.mongodb.net/?appName=Cluster0`;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// let movieCollection;

// async function run() {
//   try {
//     await client.connect();
//     const db = client.db("movie-master-db");
//     movieCollection = db.collection("movies");
//     console.log("✅ Connected to MongoDB");

//     // Test root route
//     app.get("/", (req, res) => {
//       res.send("Server is running");
//     });

//     // -------------------
//     // GET /movies - fetch all or filtered movies
//     app.get("/movies", async (req, res) => {
//       try {
//         const { genre, min, max } = req.query;
//         const query = {};

//         // Single genre filter (case-insensitive)
//         if (genre) {
//           query.genre = { $in: [new RegExp(`^${genre}$`, "i")] };
//         }

//         // Rating filter
//         if (min || max) {
//           query.rating = {};
//           if (min) query.rating.$gte = parseFloat(min);
//           if (max) query.rating.$lte = parseFloat(max);
//         }

//         const movies = await movieCollection.find(query).toArray();
//         res.send(movies);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error" });
//       }
//     });

//     // GET /movies/:id - fetch single movie
//     app.get("/movies/:id", async (req, res) => {
//       try {
//         const { id } = req.params;
//         const objectId = new ObjectId(id);
//         const result = await movieCollection.findOne({ _id: objectId });

//         if (!result) {
//           return res
//             .status(404)
//             .send({ success: false, message: "Movie not found" });
//         }

//         res.send({ success: true, result });
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error" });
//       }
//     });

//     // POST /movies - add new movie
//     app.post("/movies", async (req, res) => {
//       try {
//         const data = req.body;

//         if (!data.addedBy) {
//           return res.status(400).send({ message: "Email is required" });
//         }

//         const result = await movieCollection.insertOne(data);
//         res.send({ success: true, result });
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error" });
//       }
//     });

//     // GET /my-collections?email=... - fetch movies added by user
//     app.get("/my-collections", async (req, res) => {
//       try {
//         const email = req.query.email;
//         if (!email) {
//           return res.status(400).send({ message: "Email is required" });
//         }

//         const query = { addedBy: email };
//         const result = await movieCollection.find(query).toArray();
//         res.send(result);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error" });
//       }
//     });

//     // PUT /movies/:id - update movie
//     app.put("/movies/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updatedMovie = req.body;

//         const result = await movieCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedMovie }
//         );

//         if (result.modifiedCount > 0) {
//           res.send({ success: true, message: "Movie updated successfully!" });
//         } else {
//           res
//             .status(404)
//             .send({ success: false, message: "No movie found to update." });
//         }
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error!" });
//       }
//     });

//     // DELETE /movies/:id - delete movie
//     app.delete("/movies/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const result = await movieCollection.deleteOne({ _id: new ObjectId(id) });

//         if (result.deletedCount > 0) {
//           res.send({ success: true, message: "Movie deleted successfully!" });
//         } else {
//           res.status(404).send({ success: false, message: "No movie found to delete." });
//         }
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: "Server error!" });
//       }
//     });

//     // Test MongoDB connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("✅ Pinged your deployment. Successfully connected to MongoDB!");
//   } finally {
//     // Do not close client, keep server running
//   }
// }

// run().catch(console.dir);

// // Start server
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });






