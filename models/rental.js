const Joi = require('joi');
const mongoose = require('mongoose');
// const{customerSchema}=require('./customers');
// const{movieSchema}=require('./movies');

const Rental = mongoose.model('Rental',new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required:true
    },
    dateOut:{type:Date,required:true,default:Date.now},
    dateReturned:{type:Date},
    rentalFee:{type:Number,default:0}
}));

function validateRental(rental){
    const schema={
        customerId:Joi.string().required(),
        movieId:Joi.string().required(),
        rentalFee:Joi.number().min(1),
        dateReturned:Joi.date()
    };
    return Joi.validate(rental,schema);
}

exports.Rental = Rental;
exports.validate = validateRental;