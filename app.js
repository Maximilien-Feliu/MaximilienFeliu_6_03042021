/*****  import tools packages for the API  *****/
const express = require('express');                                     // node framework express
const mongoose = require('mongoose');                                   // MongoDB database interactions package
const path = require('path');                                           // path package for files system
const toobusy = require('toobusy-js');                                  // block requests if the server is overwhelmed, allows to prevent DoS attacks


const helmet = require('helmet');                                       // middleware functions collection that set security-related HTTP response headers 
const session = require('express-session');                             // package to store the session data on the server
const mongoSanitize = require('express-mongo-sanitize');                // package to prevent MongoDB Operator Injection
const rateLimiter = require('./middleware/rateLimiter');                // middleware to handle the number of requests by Ip
const hpp = require('hpp');                                             // protect against HTTP Parameter Pollution attacks

/*****  import the router from the folder 'routes'  *****/
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

/*****  load environment variables from the .env file into process.env  *****/
require('dotenv').config();

console.log(process.env.NODE_ENV);
console.log(process.env.NAME_SESSION);
console.log(process.env.HOST);

/*****  connect to the mongoDB database, mongoose allow implementing stricts data schemas  *****/
mongoose.connect(process.env.DB_URI,
{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();                                               // create express application

/*****  middleware which blocks requests when we're too busy  *****/
app.use((req, res, next) => {
    if (toobusy()) {
      res.send(503, "I'm busy right now, sorry.");
    } else {
      next();
    }
  });

/*****  Set headers allowing the access to the API and avoiding CORS problems   *****/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');                                                                          // Everyone can access to the API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    // Allow to use some headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');                                    // Allow to use some methods
    next();
});

/*****  set secure cookies  *****/
const expiryDate = new Date(Date.now() + 604800000);        // 1 week
app.set('trust proxy', 1);                                  // trust first proxy
app.use(session({
    name: process.env.NAME_SESSION,
    secret: process.env.PASSWORD_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: expiryDate
    }
}));

app.use(rateLimiter);

/*****  protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately  *****/
app.use(helmet());

/*****  middleware to handle POST requests (extract the JSON Object)  
 *****  set a limit of request body size to avoid large request bodies from attackers  *****/
app.use(express.urlencoded({ extended: true, limit: "100kb" }));          // parse the url encoded data with the qs library
app.use(express.json({ limit: "100kb" }));                                // transform the request body to json 

app.use(hpp());
app.use('/images', express.static(path.join(__dirname, 'images')));       // respond to the request and serve the static folder 'images'

app.use(mongoSanitize());

/*****  save the main routes for the router  *****/
app.use('/api/sauces', saucesRoutes); 
app.use('/api/auth', userRoutes);

module.exports = app;                                                     // export the application