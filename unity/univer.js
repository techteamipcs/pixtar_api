const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");
var userModel  = require('../model/others/User');

/*********** Decode JWT token *************/

exports.decodeJwtTokenFn = (req, res, next) => {
    const Authorization  = req["headers"]["Authorization"] || req["headers"]["authorization"];;
    userModel.findOne({ "loginToken": Authorization }, {
      _id: 1,
    }).then((response) => {
      let payload;
      payload = {
        _id: response._id,
      };
      req.user = payload;
      next();
    }).catch((error) => {
      return res.status(401).json({statusCode:400,message:"error"});
    })
  };