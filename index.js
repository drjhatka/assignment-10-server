const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//Mongodb config uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kuhw0k3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

//const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000


app.use(cors({
    // origin: 'https://assignment-10-client-6d815.web.app/',
    // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
    origin:true,
    credentials: true
  }))             //...cors middleware
app.use(express.json())     //...get request body

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
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
        const database          = client.db("craftsdb");
        const crafts            = await database.collection("crafts");
        const categories     = await database.collection('categories')
       
        // Connect the client to the server	(optional starting in v4.7)
        //comment this when deploying to production
        //await client.connect();
        app.post('/get-craft-by-category/:category',async(req, res)=>{
            const query  = { subcategory: req.params.category };
            const cursor = crafts.find(query)
            const result = await cursor.toArray()
            //console.log(req.params)
            res.send(result)
        })

        app.get('/get-categories',async (req, res)=>{
            const cursor =  await categories.find({});
            const result = await cursor.toArray()
            //console.log(result)
            res.send(result)
        })


        app.get('/get-all', async (req, res)=>{
            const cursor =  crafts.find({});
            const result = await cursor.toArray()
            //console.log(result)
            res.send(result)
        })
        app.get('/get-craft/:id', async (req, res)=>{
            const query = {_id: new ObjectId(req.params.id)}
            const craft = await crafts.findOne(query)
            res.send(craft)
        })
        app.post('/view-addlist',async(req, res)=>{
            //console.log(req)
            const query  = { user_email: req.body.user_email };
            const cursor = crafts.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/view-filterlist',async(req, res)=>{
            //console.log(req)
            const query  = { customization: req.body.customization, user_email: req.body.user_email };
            const cursor = crafts.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/add-craft', async (req, res)=>{
            const result = await crafts.insertOne(req.body)
            res.send(result)
        })
        app.put('/update-craft/:id',async (req, res)=>{
            console.log(req.params.id)
            const filter = {_id: new ObjectId(req.params.id)}
            const craft = {
                $set:{
                    //change all property values 
                    image_url           : req.body.image_url,
                    item_name           : req.body.item_name,
                    subcategory         : req.body.subcategory,
                    short_description   : req.body.short_description,
                    price               : req.body.price,
                    rating              : req.body.rating,
                    processing_time     : req.body.processing_time,
                    customization       : req.body.customization,
                    in_stock            : req.body.in_stock,
                    user_name           : req.body.user_name,
                    user_email          : req.body.user_email
                }
            }
            const result = await crafts.updateOne(filter,craft,{upsert:true})
            res.send(result)
        })
        app.delete('/delete-craft/:id',async (req, res)=>{ 
            const query = { _id: new ObjectId(req.params.id) };
            const result = await crafts.deleteOne(query);
            if (result.deletedCount === 1) {
                //console.log("Successfully deleted one document.");
              } else {
                //console.log("No documents matched the query. Deleted 0 documents.");
              }
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        //await client.db("admin").command({ ping: 1 });
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
