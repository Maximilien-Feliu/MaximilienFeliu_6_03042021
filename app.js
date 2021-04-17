/*****  import tools packages for the API  *****/
const express = require('express');                                     // node framework express
const bodyParser = require('body-parser');                              // body parsing package
const mongoose = require('mongoose');                                   // MongoDB database interactions package
const path = require('path');                                           // path package for files system

/*****  import the router from the folder 'routes'  *****/
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

/*****  connect to the mongoDB database, mongoose allow implementing stricts data schemas   *****/
mongoose.connect('mongodb+srv://maximilienFeliu3540:openclassrooms122020@cluster0.rthcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();                                               // create express application

/*****  Set headers allowing the access to the API and avoiding CORS problems   *****/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');                                                                          // Everyone can access to the API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    // Allow to use some headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');                                    // Allow to use some methods
    next();
});

/*****  middleware to handle POST requests (extract the JSON Object)  *****/
app.use(express.json()); // transform the request body to json 

app.use('/images', express.static(path.join(__dirname, 'images')));     // respond to the request and serve the static folder 'images'

/*****  save the main routes for the router  *****/
app.use('/api/sauces', saucesRoutes); 
app.use('/api/auth', userRoutes);

module.exports = app;                                                   // export the application