const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, required:true , ref:'users'},
    address: {
        name:  {type:String, required:true },
        house:  {type:String, required:true }, 
        post:  {type:String, required:true }, 
        city:  {type:String, required:true }, 
        district:  {type:String, required:true }, 
        state:  {type:String, required:true }, 
        pin:  {type:Number, required:true }
    },
    bill_amount: {type:Number, required:true},
    order_status:{type:String, default:'pending'},
    payment:{
        payment_method:{type:String},
        payment_id:{type:String},
        payment_order_id:{type:String},
        payment_status:{type:String, default:'pending'},
    },
    products: [
        {
            product_id:{type:String, required:true, ref:'products'},
            name:{type:String, required:true},
            size:{type:String, required:true},
            qnty:{type:Number, required:true},
            price:{type:Number, required:true},
        }
    ],
    delivery_status:{
        ordered:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        shipped:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        out_for_delivery:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        delivered:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
        cancelled:{
            state:{type:Boolean, default:false},
            date:{type:Date},
        },
    },
    coupen:{
        name:{type:String},
        code:{type:String},
        discount:{type:Number},
        ptype:{type:String},
    },
    ordered_date: {type:Date, default: Date.now(), index:true},

})

module.exports = mongoose.model("orders", ordersSchema)