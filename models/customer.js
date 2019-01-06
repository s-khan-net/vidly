const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:{type:String, required:true, minlength:3},
    isGold:{type:Boolean,default:false},
    phone:{type:String,required:true}
});
const Customer = mongoose.model('Customer',customerSchema);

function validateCustomer(customer){
    const schema = {
        name : Joi.string().min(3).required(),
        isGold:Joi.boolean(),
        phone:Joi.string().required()
    };
    return Joi.validate(customer,schema);
}
exports.customerSchema=customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;

