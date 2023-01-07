const { compare } = require("bcryptjs");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
var vCardsJS = require("vcards-js");
var path = require("path");
const nodemailer = require("nodemailer");
const { ObjectId } = require("bson");
var builder = require("xmlbuilder");
var fs = require("fs");
const dotenv = require("dotenv");

const moment = require("moment");
let axios = require("axios");
dotenv.config();

var BusinesscardModal = require("../../model/businesscard/Businesscard");

exports.add_businesscard = async (req, res) => {
  const businesscardlins = new BusinesscardModal({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    namePrefix: req.body.namePrefix,
    nickname: req.body.nickname,
    gender: req.body.gender,
    organization: req.body.organization,
    profile_photo: req.body.profile_photo,
    vcard_photo: req.body.vcard_photo,
    cellPhone: req.body.cellPhone,
    workPhone: req.body.workPhone,
    title: req.body.title,
    role: req.body.role,
    email: req.body.email,
    workEmail: req.body.workEmail,
    url: req.body.url,
    workUrl: req.body.workUrl,
    add_street: req.body.add_street,
    add_city: req.body.add_city,
    add_stateProvince: req.body.add_stateProvince,
    add_postalCode: req.body.add_postalCode,
    add_countryRegion: req.body.add_countryRegion,
    note: req.body.note,
    sociallink_facebook: req.body.sociallink_facebook,
    sociallink_instagram: req.body.sociallink_instagram,
    sociallink_linkedIn: req.body.sociallink_linkedIn,
    sociallink_twitter: req.body.sociallink_twitter,
  });
  try {
    const BusinesscardlData = await businesscardlins.save();
    outputJson = {
      code: 200,
      status: "Success",
      message: "Businesscard Add Successfully",
    };
    res.json(outputJson);
  } catch (error) {
    outputJson = {
      code: 400,
      status: "Faild",
      message: "Businesscard Add Faild",
    };
    res.json(outputJson);
  }
};

exports.editBusinesscarddata = async (req, res) => {
  let where = { _id: req.query.id };
  let getBusinesscard = await BusinesscardModal.findOne(where);
  let ImageName;
  if (req.body.image == null) {
    ImageName = getBusinesscard.image;
  } else {
    ImageName = req.body.image;
  }
  let obj = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    namePrefix: req.body.namePrefix,
    nickname: req.body.nickname,
    gender: req.body.gender,
    organization: req.body.organization,
    profile_photo: req.body.profile_photo,
    vcard_photo: req.body.vcard_photo,
    cellPhone: req.body.cellPhone,
    workPhone: req.body.workPhone,
    title: req.body.title,
    role: req.body.role,
    email: req.body.email,
    workEmail: req.body.workEmail,
    url: req.body.url,
    workUrl: req.body.workUrl,
    add_street: req.body.add_street,
    add_city: req.body.add_city,
    add_stateProvince: req.body.add_stateProvince,
    add_postalCode: req.body.add_postalCode,
    add_countryRegion: req.body.add_countryRegion,
    note: req.body.note,
    sociallink_facebook: req.body.sociallink_facebook,
    sociallink_instagram: req.body.sociallink_instagram,
    sociallink_linkedIn: req.body.sociallink_linkedIn,
    sociallink_twitter: req.body.sociallink_twitter,
  };
  try {
    let result = await BusinesscardModal.findOneAndUpdate(
      { _id: ObjectId(req.query.id) },
      obj
    );
    outputJson = {
      code: 200,
      status: "Success",
      message: "Update Businesscard successfully.",
      result: result,
    };
    res.json(outputJson);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

exports.getBusinesscardWithId = async (req, res) => {
  var postData = req.body;
  let where = { _id: postData.id };
  let result = await BusinesscardModal.findOne(where);
  outputJson = {
    code: 200,
    status: "Success",
    message: "Businesscard List successfully.",
    result: result,
  };
  res.json(outputJson);
};

exports.view_businesscard = async (req, res) => {
  let where = {};
  where["isDeleted"] = false;
  let Businesscardaggregate = [
    {
      $match: where,
    },
    { $limit: 3 },
    {
      $project: {
        _id: 1,
        firstName: 1,
        middleName: 1,
        lastName: 1,
        namePrefix: 1,
        nickname: 1,
        gender: 1,
        organization: 1,
        profile_photo: 1,
        vcard_photo: 1,
        cellPhone: 1,
        workPhone: 1,
        title: 1,
        role: 1,
        email: 1,
        workEmail: 1,
        url: 1,
        workUrl: 1,
        add_street: 1,
        add_city: 1,
        add_stateProvince: 1,
        add_postalCode: 1,
        add_countryRegion: 1,
        note: 1,
        sociallink_facebook: 1,
        sociallink_instagram: 1,
        sociallink_linkedIn: 1,
        sociallink_twitter: 1,
        isVcardGenerated: 1,
      },
    },
  ];
  var show_businesscard = await BusinesscardModal.aggregate(
    Businesscardaggregate
  );
  try {
    outputJson = {
      code: 200,
      status: "Success",
      message: "View Businesscard Successfully",
      businesscardData: show_businesscard,
    };
    res.json(outputJson);
  } catch (error) {
    outputJson = {
      code: 400,
      status: "Faild",
      message: "View Businesscard Faild",
    };
    res.json(outputJson);
  }
};

exports.all_businesscard = async (req, res) => {
  let postData = req.body;
  let limit = 9;
  let page = postData.page || 1;
  let skiprecord = limit * page - limit;
  let where = {};
  //where["isDeleted"] = false;
  let Allbusinesscardaggregate = [
    {
      $match: where,
    },
    { $sort: { _id: -1 } },
    { $skip: skiprecord },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        firstName: 1,
        middleName: 1,
        lastName: 1,
        namePrefix: 1,
        nickname: 1,
        gender: 1,
        organization: 1,
        profile_photo: 1,
        vcard_photo: 1,
        cellPhone: 1,
        workPhone: 1,
        title: 1,
        role: 1,
        email: 1,
        workEmail: 1,
        url: 1,
        workUrl: 1,
        add_street: 1,
        add_city: 1,
        add_stateProvince: 1,
        add_postalCode: 1,
        add_countryRegion: 1,
        note: 1,
        sociallink_facebook: 1,
        sociallink_instagram: 1,
        sociallink_linkedIn: 1,
        sociallink_twitter: 1,
        isVcardGenerated: 1,
      },
    },
  ];
  var all_businesscard = await BusinesscardModal.aggregate(
    Allbusinesscardaggregate
  );
  let totalrecord = await BusinesscardModal.find({ isDeleted: false }).count();
  try {
    outputJson = {
      code: 200,
      status: "Success",
      message: "View Businesscard Successfully",
      result: all_businesscard,
      page: page,
      limit: limit,
      count: totalrecord,
    };
    res.json(outputJson);
  } catch (error) {
    outputJson = {
      code: 400,
      status: "Faild",
      message: "View Businesscard Faild",
    };
    res.json(outputJson);
  }
};

// Delete Businesscard

exports.deleteBusinesscard = async (req, res) => {
  let cid = ObjectId(req.body.id);
  let where = {};
  where["_id"] = cid;
  where["isDeleted"] = false;
  try {
    let result = await BusinesscardModal.deleteOne({ _id: cid });
    outputJson = {
      code: 200,
      status: "Success",
      message: "Update Businesscard successfully.",
      result: result,
    };
    res.json(outputJson);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

// Delete Businesscard

exports.generateVCF = async (req, res) => {
  let cid = ObjectId(req.body.id);
  let where = {};
  where["_id"] = cid;
  let getBusinesscard = await BusinesscardModal.findOne(where);

  let vCard = vCardsJS();
  vCard.version = "3.0";
  if(getBusinesscard.firstName)
    vCard.firstName = getBusinesscard.firstName;
  if(getBusinesscard.middleName)
    vCard.middleName = getBusinesscard.middleName;
  if(getBusinesscard.lastName)
  vCard.lastName = getBusinesscard.lastName;
  if(getBusinesscard.namePrefix)
    vCard.namePrefix = getBusinesscard.namePrefix;
  if(getBusinesscard.nickname)
    vCard.nickname = getBusinesscard.nickname;
  if(getBusinesscard.gender)
    vCard.gender = getBusinesscard.gender;
  if(getBusinesscard.organization)
    vCard.organization = getBusinesscard.organization;
  // Add a profile photo by fetching from a URL
  if(getBusinesscard.vcard_photo){
    let image = await axios.get(process.env.URL_ENDPOINT+ "/public/" + getBusinesscard.vcard_photo,
      { responseType: "arraybuffer" }
    );
    let imageBase64 = Buffer.from(image.data).toString("base64");
    vCard.photo.embedFromString(imageBase64, "image/jpeg");
  }
  if(getBusinesscard.workPhone)
    vCard.workPhone = getBusinesscard.workPhone;
  if(getBusinesscard.cellPhone)
    vCard.cellPhone = getBusinesscard.cellPhone;
  if(getBusinesscard.title)
    vCard.title = getBusinesscard.title;
  if(getBusinesscard.role)
    vCard.role = getBusinesscard.role;
  if(getBusinesscard.email)
    vCard.email = getBusinesscard.email;
  if(getBusinesscard.workEmail)
    vCard.workEmail = getBusinesscard.workEmail;
  if(getBusinesscard.url)
    vCard.url = getBusinesscard.url;
  if(getBusinesscard.workUrl)
    vCard.workUrl = getBusinesscard.workUrl;
  vCard.homeAddress.label = "Home Address";
  if(getBusinesscard.add_street)
    vCard.homeAddress.street = getBusinesscard.add_street;
  if(getBusinesscard.add_city)
    vCard.homeAddress.city = getBusinesscard.add_city;
  if(getBusinesscard.add_stateProvince)
    vCard.homeAddress.stateProvince = getBusinesscard.add_stateProvince;
  if(getBusinesscard.add_postalCode)
    vCard.homeAddress.postalCode = getBusinesscard.add_postalCode;
  if(getBusinesscard.add_countryRegion)
    vCard.homeAddress.countryRegion = getBusinesscard.add_countryRegion;
  if(getBusinesscard.note)
    vCard.note = getBusinesscard.note;
  if(getBusinesscard.sociallink_facebook)
    vCard.socialUrls.Facebook = getBusinesscard.sociallink_facebook;
  if(getBusinesscard.sociallink_instagram)
    vCard.socialUrls.Instagram = getBusinesscard.sociallink_instagram;
  if(getBusinesscard.sociallink_linkedIn)
    vCard.socialUrls.LinkedIn = getBusinesscard.sociallink_linkedIn;
  if(getBusinesscard.sociallink_twitter)
    vCard.socialUrls.Twitter = getBusinesscard.sociallink_twitter;
  vCard.saveToFile("./public/vcards/" + getBusinesscard.firstName + ".vcf");
  let obj = {
    isVcardGenerated: true,
  };

  try {
    let result = await BusinesscardModal.findOneAndUpdate(
      { _id: ObjectId(req.body.id) },
      obj
    );
    outputJson = {
      code: 200,
      status: "Success",
      message: "Update Businesscard successfully.",
      result: result,
    };
    res.json(outputJson);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};
