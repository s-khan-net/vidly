const {Movie,validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/',async (req,res)=>{
    res.send(await Movie.find().sort('title'));
});


router.get('/:id',async (req,res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(402).send(`the genere with id:${req.params.id} could not be found`);
    res.send(movie);
});

router.post('/',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send(`the genre with id ${req.body.genreId} was not found`);

    var movie = new Movie({
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name,
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
});

router.put('/:id',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    var movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(402).send(`the movie with id:${req.params.id} could not be found`);
    var genre={};
    if(req.body.genreId!=null){
        genre = await Genre.findById(req.body.genreId);
        if(!genre) return res.status(400).send(`the genre with id ${req.body.genreId} was not found`);
    }
    movie = await Movie.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name,
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    },
    {new : true});
    // var movie = await Movie.findById(req.params.id);
    // if(!movie) return res.status(402).send(`the customer with id:${req.params.id} could not be found`);

    // if(req.body.isGold!=null){movie.isGold = req.body.isGold;}
    // movie.title = req.body.title;
    // if(req.body.phone!=null){movie.phone=req.body.phone;}
    
    // movie = await movie.save();
    
    res.send(movie);
});
router.delete('/:id',auth,async (req,res)=>{
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if(!movie) return res.status(402).send(`the customer with id:${req.params.id} could not be found`);
    res.send(movie);
});


module.exports = router;