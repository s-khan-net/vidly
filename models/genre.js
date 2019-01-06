const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name:{type:String, required:true, minlength:3},
    isActive:{type:Boolean,default:true}
})
const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = {
        name : Joi.string().min(3).required()
        //isActive:Joi.boolean()
    };
    return Joi.validate(genre,schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;