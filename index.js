const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("server is running")
})






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try { 
        await client.connect();
const db = client.db('movie-master-db')
const movieCollection = db.collection('movies')

// findMany
// findOne

app.get('/movies',async(req,res)=>{
 const result = await  movieCollection.find().toArray()
 res.send(result)
})

app.get('/movies/:id',async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    const objectId = new ObjectId(id)
    const result = await movieCollection.findOne({_id:objectId})
    res.send({
        success:true,
        result
    })
})

//post method
// insertMany
// insertOne

app.post("/movies",async(req,res)=>{
    const data = req.body;
    console.log(data)
   const result = await movieCollection.insertOne(data) 
res.send({
    success:true,
    result
})
})

// 🧠 Update movie by ID
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