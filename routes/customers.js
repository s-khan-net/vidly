const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/',async (req,res)=>{
    res.send(await Customer.find().sort('name'));
});

router.get('/:id',async (req,res)=>{
    const genre = await Customer.findById(req.params.id);
    if(!genre) return res.status(402).send(`the Customer with id:${req.params.id} could not be found`);
    res.send(genre);
});
router.post('/',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    var customer = {};
    if(req.body.isGold!=undefined){
        customer = new Customer({
            name:req.body.name,
            phone:req.body.phone,
            isGold:req.body.isGold
        });
    }
    else{
        customer = new Customer({
            name:req.body.name,
            phone:req.body.phone
        });
    }
    customer = await customer.save();
    res.send(customer);
});
router.put('/:id',auth,async (req,res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // var customer ={};
    // if(req.body.isGold!=null){
    //     customer = await Customer.findByIdAndUpdate(req.params.id,{name:req.body.name,phone:req.body.phone,isGold:req.body.isGold},{new : true});
    // }
    // else{
    //     customer = await Customer.findByIdAndUpdate(req.params.id,{name:req.body.name,phone:req.body.phone},{new : true});
    // }
    var customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(402).send(`the customer with id:${req.params.id} could not be found`);

    if(req.body.isGold!=null){customer.isGold = req.body.isGold;}
    customer.name = req.body.name;
    if(req.body.phone!=null){customer.phone=req.body.phone;}
    
    customer = await customer.save();
    
    res.send(customer);
});
router.delete('/:id',async (req,res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(402).send(`the customer with id:${req.params.id} could not be found`);
    res.send(customer);
});


module.exports = router;