const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({ 
    name: { type: String,required: true},
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: Array, required: true },
    message: { type: String, required: true },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});

module.exports = mongoose.model("contact", dataSchema);