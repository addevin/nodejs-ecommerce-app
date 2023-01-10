const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    image: {type:String},
    name: {type:String, required:true, unique:true, index:true, lowercase: true,},
    last_updated_user: {type:String, required:true},
    last_updated: {type:Date, default: Date.now()},
    tags:{type:Array}
})

module.exports = mongoose.model("categories", categoriesSchema)