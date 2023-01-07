const mongoose = require('mongoose');

// status: { type: Boolean, default:true }, //AUTO STATUS ENABLED!!!
const couponSchema = new mongoose.Schema({
    name: { type: String, required:true},
    code: { type: String, required:true, unique:true, index:true},
    min_bill: {type:Number},
    discount: {type:Number, required:true},
    pType: {type:String, required:true},
    last_updated_user: {type:String, required:true},
    last_updated: {type:Date, default: Date.now},
    expire: {type:Date, required:true},
})

module.exports = mongoose.model("coupon", couponSchema)