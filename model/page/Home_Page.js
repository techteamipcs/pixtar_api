const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({
    page_name : { type: String, required: true }, 
    global_spot_league: { type: String, required: true },
    top_league_title1: { type: String, required: true }, 
    top_league_description1: { type: String, required: true },
    top_league_title2: { type: String, required: true }, 
    top_league_description2: { type: String, required: true },
    top_league_title3: { type: String, required: true }, 
    top_league_description3: { type: String, required: true },
    top_league_title4: { type: String, required: true }, 
    top_league_description4: { type: String, required: true },
    top_league_title5: { type: String, required: true }, 
    top_league_description5: { type: String, required: true },
    active_user: { type: String, required: true },
    total_active_user: { type: String, required: true },
    download: { type: String, required: true },
    total_download: { type: String, required: true },
    winning_credit: { type: String, required: true },
    total_winning_credit: { type: String, required: true }, 
    meta_description : { type: String, required: true },
    meta_title: { type: String, required: true },
    meta_keywords : { type: String, required: true },
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});  

module.exports = mongoose.model("homepage", dataSchema);