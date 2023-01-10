const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {   
        username: {type:String, required:true, unique:true, index: true},
        name: {type:String, required:true, index: true},
        email: {type:String, required: true, unique:true , index: true},
        phone: {type:Number, required: true, unique:true, index: true},
        password: {type:String, required: true},
        phone_verified: {type:Boolean, default:false},
        email_verified: {type:Boolean, default: false},
        email_id: {type:String},
        address:[
            {
                name:  {type:String, required:true},
                house:  {type:String}, 
                post:  {type:String}, 
                city:  {type:String}, 
                district:  {type:String}, 
                state:  {type:String}, 
                pin:  {type:Number}
            }
        ],
        cart:
            [
                {
                    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'products', required:true, index:true },
                    quantity:{type:Number, required:true }
                },
            ]
        ,
        state:{
            deleted:{type:Boolean, default:false},
        },
        wishlist:[mongoose.Schema.Types.ObjectId],
        status:  {type:String, default: "active"},
        login_sess:  {type:String},
        joined:   {type:Date, default: Date.now()},
        last_login: {type:Date, default: Date.now()},
        
    }
    // ,{timestamps:true}
)

module.exports = mongoose.model("users", userSchema)