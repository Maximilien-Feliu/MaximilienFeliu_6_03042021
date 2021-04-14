const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const cors = require('cors');

const User = require('./models/User');
const userRoutes = require('./routes/user');

const Sauces = require('./models/Sauces');
const saucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://maximilienFeliu3540:openclassrooms122020@cluster0.rthcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Cintrol-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;