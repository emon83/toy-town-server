const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mt8kgrw.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection


    const categoryProductsCollection = client.db("toyTownDB").collection("categoryProducts");
    const allProductsCollection = client.db("toyTownDB").collection("allProducts");

    app.get('/categoryProducts', async (req, res)=> {
      const result = await categoryProductsCollection.find().toArray();
      res.json(result);
    })

    app.get('/categoryProducts/:id', async (req, res)=> {
      const id = req.params.id;
      const curser = { _id: new ObjectId(id) };
      const result = await categoryProductsCollection.find(curser).toArray();
      res.json(result);
    })


    app.get('/allToys', async (req, res)=> {
      const result = await allProductsCollection.find().toArray();
      res.send(result);
    })

    app.get('/toyDetails/:id', async (req, res)=> {
      const id = req.params.id;
      const curser = { _id: new ObjectId(id) };
      const result = await allProductsCollection.find(curser).toArray();
      res.send(result);
    })

    app.get('/myToys/:email', async (req, res)=> {
      //console.log(req.params.email);
      const result = await allProductsCollection
        .find({
          sellerEmail: req.params.email,
        })
        .toArray();
      res.send(result);
    })

    app.get("/allToysByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await allProductsCollection
        .find({
          $or: [
            { toyName: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    app.post('/postToys', async (req, res)=> {
      const body = req.body;
      const result = await allProductsCollection.insertOne(body);
      console.log(result);
      res.json(result);
    })
    app.put('/myToy/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      console.log(body);
      const updateDoc = {
        $set: {
          price: body.price,
          quantity: body.quantity,
          description: body.description,
        },
      }
      const result = await allProductsCollection.updateOne(filter, updateDoc);
      res.send(result);
    })
    
    app.delete("/myToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allProductsCollection.deleteOne(query);
      res.send(result);
    });
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Toy Town is running!");
  });
  
  app.listen(port, () => {
    console.log(`Toy Town server is running on port ${port}`);
  });