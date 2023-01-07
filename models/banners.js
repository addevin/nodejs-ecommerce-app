const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        image:  {type:String, required:true},
        bh1:  {type:String, required:true}, 
        bh2:  {type:String, required:true}, 
        para:  {type:String, required:true},
        bc:  {type:String, required:true},
        tc:  {type:String, required:true},
    }
       
)

module.exports = mongoose.model("banner", bannerSchema)