const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
ObjectId       = Schema.ObjectId; 

const dataSchema = new mongoose.Schema({ 
    meta_description : { type: String, required: true },
    meta_title: { type: String, required: true },
    meta_keywords : { type: String, required: true },
    image: { type: String},
    category: { type: String},
    name: { type: String, required: true },
    slug: { type: String, required: true },
    author : {type: ObjectId, required: true},
    tag_list: [{type: mongoose.Schema.Types.ObjectId,dafault:[],required: true}],
    content : { type: String, required: true },
    content_type : { type: String, required: true },
    video_link  : { type: String, required: false },
    featured : { type: Boolean, default: false },
    virtual_id: { type: String, required: false }, 
    created_at: {type: Date,required: true,default: Date.now,},
    updated_at: {type: Date,required: true,default: Date.now,},
    isDeleted: { type: Boolean, default: false },  
});  

module.exports = mongoose.model("blog", dataSchema);