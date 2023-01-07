const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
const nodemailer     = require("nodemailer");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
var BlogModal        = require('../../model/blog/Blog');
var AuthorModal      = require('../../model/blog/Author');
var TagModal         = require('../../model/blog/Tag');
var CommentModal     = require('../../model/blog/Comment');

exports.addComment  = async (req, res) => {
    const commentlins = new CommentModal({ 
        votes: '',     
        name : req.body.name,
        email : req.body.email,  
        mobile : req.body.mobile,
        content : req.body.cmt_txt,
        post: req.body.post,
        savedata: req.body.savedata
    })  
    try
    {     
        const commentData = await commentlins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Comment Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Comment Add Faild'};
        res.json(outputJson);
    }
};

exports.view_comment  = async (req, res) => {
    var postData = req.body;
    let show_comment  = await CommentModal.find({post: postData.id});
    try
    {
        outputJson   = {code: 200, status: "Success",message: 'View Comment Successfully',result:show_comment};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Comment Faild'};
        res.json(outputJson);
    }
};
