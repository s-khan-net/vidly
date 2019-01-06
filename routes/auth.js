const express = require('express');
const Joi = require('joi');
const router = express.Router();
const _ = require('lodash');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');


router.post('/',async (req,res)=>{
    const {error} =validate(req.body);
    if(error) return res.status(400).send('Invalid user.');

    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid user.');

    const valid = bcrypt.compare(req.body.password,user.password);
    if(!valid) return res.status(400).send('Invalid user.');

    let token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email']));
});

function validate(user){
    const schema = {
        email:Joi.string().min(5).email().required(),
        password:Joi.string().min(5).required()
    };
    return Joi.validate(user,schema);
}

module.exports = router;