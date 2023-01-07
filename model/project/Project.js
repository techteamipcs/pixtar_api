const mongoose = require("mongoose");


const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: Array, required: true },
  link: { type: String, required: true },
  image: { type: String },
  project_images: [],
  meta_description: { type: String, required: true },
  meta_title: { type: String, required: true },
  meta_keywords: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
});

module.exports = mongoose.model("project", dataSchema);