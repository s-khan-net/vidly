const {Rental,validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/',async (req,res)=>{
    res.send(await Rental.find().populate('customer').populate('movie').sort('-dateOut'));
});

router.get('/:id',async (req,res)=>{
    const rental = await Rental.findById(req.params.id);
    if(!rental) return res.status(402).send(`the rental with id:${req.params.id} could not be found`);
    res.send(rental);
});

router.post('/',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const movie = Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    if(parseInt(req.body.rentalFee)>0){
        rental = new Rental({
            customer:req.body.customerId,
            movie:req.body.movieId,
            rentalFee:req.body.rentalFee,
        });
    }
    else{
        rental = new Rental({
            customer:req.body.customerId,
            movie:req.body.movieId,
        });
    }   

    await rental.save();
    res.send(rental);
});

router.put('/:id',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let rental=Rental.findById(req.params.id);
    if(!rental) return res.status(400).send('Rental not found');

    const customer = Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const movie = Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie');

    let dateReturned = req.body.dateReturned || Date.now;
    if(parseInt(req.body.rentalFee)>0){
        rental.customer=req.body.customerId;
        rental.movie=req.body.movieId;
        rental.rentalFee=req.body.rentalFee;
        rental.dateReturned=dateReturned;
    }
    else{
        rental.customer=req.body.customerId;
        rental.movie=req.body.movieId;
        rental.dateReturned=dateReturned;
    }   
    
    await rental.save();
    res.send(rental);
});

module.exports = router;