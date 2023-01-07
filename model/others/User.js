const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({ 
    username: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    loginToken: {type: String},
    isDeleted: { type: Boolean, default: false },  
});

module.exports = mongoose.model("user", dataSchema);