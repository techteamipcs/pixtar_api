const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({ 
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile : { type: String, required: true },
    instagram : { type: String},
    facebook  : { type: String},
    twitter : { type: String},
    youtube: { type: String}, 
    message : { type: String, required: true },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});  

module.exports = mongoose.model("influencer-program", dataSchema);