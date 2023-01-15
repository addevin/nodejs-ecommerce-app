const mongoose = require('mongoose');

const adminsSchema = new mongoose.Schema({
    name: {type:String, required:true, unique:true, index:true},
    username: {type:String, required:true, unique:true, index:true},
    email: {type:String, required:true, unique:true, index:true},
    password:{type:String, required:true},
    login_sess:{type:String},
    state:{
        deleted:{type:Boolean, default:false},
    },
    joined: {type:Date, default: Date.now()},
    last_login: {type:Date},
})

module.exports = mongoose.model("admins", adminsSchema)