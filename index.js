const config = require('config');
const logger = require('./logger');
const mongoose = require('mongoose');
const error = require('./middleware/error');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users =require('./routes/users');
const auth =require('./routes/auth');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.static('public'));
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use(logger);
//console.log(app.get('env'));
app.get('/',(req,res)=>{ 
    res.send('<h1>wassup</h1>');
});
app.use(error);



if(!config.get('jwtKey')) {
    console.log('FATAL ERROR: jwt token key not set');
    process.exit(1);
}



let port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening to post ${port}...`));