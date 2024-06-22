const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const app       = express()
const port      = process.env.PORT || 5000

//Mongodb config uri
const uri = ''

app.use(express.json())     //...get request body
app.use(cors())             //...cors middleware

// Use Helmet! to disable cors policy upon deployment
//app.use(helmet());

// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         "default-src": ["'self'"],
//         "connect-src": ["'self'", "'unsafe-inline'"],
//         "img-src": ["'self'", "data:"],
//         "style-src-elem": ["'self'", "data:"],
//         "script-src": ["'unsafe-inline'", "'self'"],
//         "object-src": ["'none'"],
//       },
//     })
//   );
