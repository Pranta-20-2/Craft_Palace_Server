const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000

//MiddleWere
app.use(cors({
    origin: ["https://art-craft-store-919cb.web.app", "http://localhost:5173"]
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dstmmd5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const craftCollection = client.db("craftDB").collection('craft')
        const subCatCollection = client.db("craftDB").collection('subCat')

        app.get('/crafts', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        //view details
        app.get('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query)
            res.send(result)
        })
        //Update
        app.get('/upCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query)
            res.send(result)
        })

        // My Cart
        app.get("/myCrafts/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await craftCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        app.post('/crafts', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
        })
        // Sub Cat add
        app.post('/subcat', async (req, res) => {
            const newSubCat = req.body;
            console.log(newSubCat);
            const result = await subCatCollection.insertOne(newSubCat);
            res.send(result);
        })

        app.delete('/delCrafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCraft = req.body;
            const craft = {
                $set: {
                    itemName: updatedCraft.itemName,
                    subcategory: updatedCraft.subcategory,
                    description: updatedCraft.description,
                    price: updatedCraft.price,
                    rating: updatedCraft.rating,
                    customization: updatedCraft.customization,
                    processingTime: updatedCraft.processingTime,
                    stockStatus: updatedCraft.stockStatus,
                    photo: updatedCraft.photo
                }

            }
            const result = await craftCollection.updateOne(filter, craft, options)
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Art Craft server is running')
})

app.listen(port, () => {
    console.log(`Art port running on the port: ${port}`);
})