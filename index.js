const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//Mongodb config uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kuhw0k3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

//const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000


app.use(express.json())     //...get request body
app.use(cors())             //...cors middleware

// Use Helmet! to disable cors policy upon deployment
//app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "style-src-elem": ["'self'", "data:"],
        "script-src": ["'unsafe-inline'", "'self'"],
        "object-src": ["'none'"],
      },
    })
  );

//Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("craftsdb");
        const crafts = await database.collection("crafts");
       // const query = {_id: new ObjectId()}
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        
        app.get('/get-all', async (req, res)=>{
            const cursor =  crafts.find({});
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)
        })
        app.get('/get-craft/:id', async (req, res)=>{
            console.log(req.params.id)
            const query = {_id: new ObjectId()}
            const craft = await crafts.findOne(query)
            res.send(craft)

        })
        app.post('/add-craft', async (req, res)=>{
            const result = await crafts.insertOne(req.body)
            console.log(req, result)
            res.send(result)
        })
        app.put('/update-phone/:slug',async (req, res)=>{
            console.log('Params ',req.params.slug)
            const filter = {slug:req.params.slug}
            const phone = {
                $set:{
                    phone_name:req.body.phone_name,
                    brand: req.body.brand,
                    image:req.body.image
                }
            }
            const result = await crafts.updateOne(filter,phone,{upsert:true})
            res.send(result)

        })
        app.delete('/delete-phone/:slug',async (req, res)=>{ 
            const query = { slug: req.params.slug };
            const result = await crafts.deleteOne(query);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
              } else {
                console.log("No documents matched the query. Deleted 0 documents.");
              }
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('backend running')
})
