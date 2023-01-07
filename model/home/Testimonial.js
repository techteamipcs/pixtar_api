const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({ 
    image : { type: String, required: true },
    name: { type: String},
    location: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    job: { type: Array, required: true },
    featured : { type: Boolean, default: false },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});

module.exports = mongoose.model("testimonial", dataSchema);