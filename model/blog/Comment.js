const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({  
    votes : { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile  : { type: String, required: true },
    content : { type: String, required: true }, 
    post : {type: ObjectId, required: true},   
    savedata: { type: Boolean, default: false },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
}); 

module.exports = mongoose.model("comment", dataSchema);