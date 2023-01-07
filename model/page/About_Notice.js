const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({
    name : { type: String, required: true }, 
    image: { type: String},
    description: { type: String, required: true },
    read_link  : { type: String, required: false },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});  

module.exports = mongoose.model("aboutnotice", dataSchema);