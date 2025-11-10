const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
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