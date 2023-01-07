const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
const nodemailer     = require("nodemailer");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
 
var AuthorModal        = require('../../model/blog/Author');
var CareerModal        = require('../../model/career/Career');

exports.addCareer  = async (req, res) => {
    const taglins = new CareerModal({   
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        name : req.body.name,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(),  
        location : req.body.location,
        description : req.body.description,
        outer_link: req.body.outer_link, 
    }) 
    try
    {   
        const tagData = await taglins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Career Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Career Add Faild'};
        res.json(outputJson);
    }
};

exports.view_career  = async (req, res) => {
    var postData = req.body;
    let where_career  = {isDeleted: false}
    let result_career = await CareerModal.find(where_career);
    outputJson = { code: 200, status: "Success", message: 'Comment List successfully.', result: result_career};
    res.json(outputJson);
};



exports.admin_view_career  = async (req, res) => {
     
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Alltagaggregate = [
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              location:1,
              description:1,
              created_at:1
            } 
        },  
    ];
    var all_career = await CareerModal.aggregate(
        Alltagaggregate
    );
    let totalrecord = await CareerModal.find({isDeleted: false}).count();

    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View Career Successfully',
                        result:all_career,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                    };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Career Faild'};
        res.json(outputJson);
    }
};



exports.get_career_with_id  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await CareerModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'View Career successfully.', result: result};
    res.json(outputJson);
};




exports.edit_career_data = async (req, res) => {
    let where    = {_id:req.query.id,isDeleted:false}
    
    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        location : req.body.location,
        name : req.body.name,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(),
        description : req.body.description,
        outer_link: req.body.outer_link,
    }
    try {
        let result = await CareerModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Career successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.delete_career = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await CareerModal.findOneAndUpdate(where, {
        isDeleted: true,
        });     
        outputJson = { code: 200, status: "Success", message: 'Update Career successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};
