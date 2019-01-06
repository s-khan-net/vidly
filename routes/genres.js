const {Genre,validate} = require('../models/genre');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/',async (req,res)=>{
    res.send(await Genre.find().sort('name'));
});

router.get('/:id',async (req,res)=>{
    const genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(402).send(`the genere with id:${req.params.id} could not be found`);
    res.send(genre);
});
router.post('/',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    var genre = new Genre({
        name:req.body.name
    });
    genre = await genre.save();
    res.send(genre);
});
router.put('/:id',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new : true});
    console.log(genre);
    if(!genre) return res.status(402).send(`the genere with id:${req.params.id} could not be found`);
    
    res.send(genre);
});
router.delete('/:id',[auth,admin],async (req,res)=>{
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if(!genre) return res.status(402).send(`the genere with id:${req.params.id} could not be found`);
    res.send(genre);
});


module.exports = router;