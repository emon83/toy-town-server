const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mt8kgrw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// validate jwt
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  // bearer token
  const token = authorization.split(" ")[1];
  console.log(authorization, token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const usersCollection = client.db("toyTownDB").collection("users");
    const allProductsCollection = client
      .db("toyTownDB")
      .collection("allProducts");
    const cartProductsCollection = client
      .db("toyTownDB")
      .collection("cartProduct");
    const paymentsCollection = client
      .db("toyTownDB")
      .collection("paymentProduct");
    const feedbacksCollection = client.db("toyTownDB").collection("feedbacks");

    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    /*********** USER RELATE APIS **********/

    //get all users to db
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // Get user by email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //save user email and role in DB
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //make seller user
    app.patch("/users/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $unset: {
          role: 1, // 1 indicates to unset the 'role' field
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
      // console.log(result);
    });

    //make seller user
    app.patch("/users/seller/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "seller",
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
      // console.log(result);
    });

    //make admin user
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
      // console.log(result);
    });

    //delete a user
    app.delete("/users/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    /*********** PRODUCT RELATE APIS **********/

    app.post("/saveProduct", async (req, res) => {
      const body = req.body;
      const result = await allProductsCollection.insertOne(body);
      res.json(result);
    });

    app.get("/allProducts", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.send(result);
    });

    app.get("/allProducts/:category", async (req, res) => {
      const { category } = req.params;
      const result = await allProductsCollection.find().toArray();
      const filteredProducts = result.filter(
        (item) => item.product_category === category
      );
      res.send(filteredProducts);
    });

    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const curser = { _id: new ObjectId(id) };
      const result = await allProductsCollection.findOne(curser);
      res.send(result);
    });

    // app.get("/myProducts/:email", async (req, res) => {
    //   const query = req.params.email;
    //   console.log(query);

    //   const sort = req?.query?.sort === "asc" ? 1 : -1;
    //   const result = await allProductsCollection
    //     .find(query)
    //     .sort({ price: sort })
    //     .toArray();
    //   res.send(result);
    // });

    app.get("/myProducts/:email", async (req, res) => {
      const email = req.params.email;
      if (!email) {
        res.send([]);
      }
      const result = await allProductsCollection.find().toArray();
      const filteredProducts = result.filter(
        (item) => item.seller_email === email
      );
      res.send(filteredProducts);
    });

    // search by product name
    app.get("/allToysByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await allProductsCollection
        .find({
          $or: [{ toyName: { $regex: text, $options: "i" } }],
        })
        .toArray();
      res.send(result);
    });

    app.patch("/updateProduct/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateData = req.body;

        const result = await allProductsCollection.updateOne(filter, {
          $set: updateData,
        });

        if (result.matchedCount === 0) {
          // No document matched the filter
          return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Update product status and remove the "status" property
    app.patch("/approveProduct/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateData = { $unset: { status: "" } }; // Use $unset to remove the "status" property

        const result = await allProductsCollection.updateOne(
          filter,
          updateData
        );

        if (result.matchedCount === 0) {
          // No document matched the filter
          return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product approved successfully" });
      } catch (error) {
        console.error("Error approving product:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allProductsCollection.deleteOne(query);
      res.send(result);
    });

    /*********** SELECTED PRODUCT RELATE APIS **********/

    //save cart product by user
    app.post("/cartProduct", async (req, res) => {
      const productData = req.body;
      const result = await cartProductsCollection.insertOne(productData);
      res.send(result);
    });

    //Get product by email
    app.get("/cartProducts/:email", async (req, res) => {
      const email = req.params.email;
      if (!email) {
        res.send([]);
      }
      const result = await cartProductsCollection.find().toArray();
      const filteredProducts = result.filter(
        (item) => item.customer_email === email
      );
      res.send(filteredProducts);
    });

    // Delete cart product
    app.delete("/deleteCartProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allProductsCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    /*********** PAYMENT PRODUCT RELATE APIS **********/

    //Post payment product
    app.post("/payment", async (req, res) => {
      const paymentData = req.body;
      const result = await paymentsCollection.insertOne(paymentData);
      res.send(result);
    });

    //Get payment product by email
    app.get("/payment/:email", async (req, res) => {
      const email = req.params.email;
      if (!email) {
        res.send([]);
      }
      const result = await paymentsCollection.find().toArray();
      const filteredProducts = result.filter((item) => item.email === email);
      res.send(filteredProducts);
    });

    /*********** FEEDBACK RELATE APIS **********/

    //Save feedback to database
    app.post("/feedback", async (req, res) => {
      const feedbackData = req.body;
      const result = await feedbacksCollection.insertOne(feedbackData);
      res.send(result);
    });

    //get user feedback
    app.get("/feedbacks", async (req, res) => {
      const colleges = await feedbacksCollection.find().toArray();
      res.send(colleges);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
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
