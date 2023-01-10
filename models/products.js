const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name: {type:String, required:true, index:true},
    image: {type:Array, required:true},
    category: { type: mongoose.Schema.Types.ObjectId, ref:'categories', required:true, index:true },
    discription: {type:String, required:true, index:true},
    specification: {type:String, index:true},   
    unit: {type:String, required:true},
    sizes: [
        {
            name: {type:String, required:true}, 
            stock: {type:Number, required:true},
            price: {type:Number, required:true},
        }
    ],
    last_updated_user: {type:String, required:true},
    last_updated: {type:Date, default: Date.now()},
    tags:{type:Array},
    state:{
        deleted:{type:Boolean, default:false},
    },
    status:{type:String, default:'active'},
})  
productsSchema.index({ name: 'text', discription: 'text', tags: 'text' })


module.exports = mongoose.model("products", productsSchema)