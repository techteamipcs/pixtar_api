const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({
    email: { type: String },   
    name : { type: String },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },   
});

module.exports = mongoose.model("invites", dataSchema);