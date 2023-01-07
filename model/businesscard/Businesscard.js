const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({ 
  firstName: { type:String, required:true },
  middleName: { type:String },
  lastName: { type:String, required:true },
  namePrefix: { type:String, required:true },
  nickname: { type:String },
  gender: { type:String },
  organization: { type:String, required:true },
  profile_photo: { type:String, required:true },
  vcard_photo: { type:String, required:true },
  cellPhone: { type:String, required:true },
  workPhone: { type:String },
  title: { type:String, required:true },
  role: { type:String },
  email: { type:String, required:true },
  workEmail: { type:String },
  url: { type:String },
  workUrl: { type:String },
  add_street: { type:String },
  add_city: { type:String },
  add_stateProvince: { type:String },
  add_postalCode: { type:String },
  add_countryRegion: { type:String },
  note: { type:String },
  sociallink_facebook: { type:String },
  sociallink_instagram: { type:String },
  sociallink_linkedIn: { type:String },
  sociallink_twitter: { type:String },
  isVcardGenerated : { type:Boolean }  
});

module.exports = mongoose.model("businesscard", dataSchema);
