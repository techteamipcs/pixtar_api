const { compare } = require("bcryptjs");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
var path = require("path");
const nodemailer = require("nodemailer");
const { ObjectId } = require("bson");
var builder = require("xmlbuilder");
var fs = require("fs");
const dotenv = require("dotenv");

const moment = require("moment");

var ProjectModal = require("../../model/project/Project");


(exports.project_add = async (req, res) => {
  const Project = new ProjectModal({
    name: req.body.name,
    desc: req.body.desc,
    category: req.body.category,
    link: req.body.link,
    image: req.body.image,
    meta_title: req.body.meta_title,
    meta_keywords: req.body.meta_keywords,
    meta_description: req.body.meta_description,
    status: req.body.status,
    project_images: req.body.project_images
  });
  try {
    const ProjectsData = await Project.save();
    outputJson = {
      code: 200,
      status: "Success",
      message: "Project Added Successfully",
    };
    res.json(outputJson);
  } catch (error) {
    outputJson = {
      code: 400,
      status: "Failed",
      message: "Project Adding Failed",
    };
    res.json(outputJson);
  }
}),
  // exports.projectgetall = async (req,res) => {
  //   let postData = req.body;
  //   let limit = 9;
  //   let page = postData.page || 1;
  //   let skiprecord = limit
  // }

  (exports.project_view = async (req, res) => {
    var postData = req.body;
    let where_project = { isDeleted: false };
    let result_project = await ProjectModal.find(where_project);
    outputJson = {
      code: 200,
      status: "Success",
      message: "Project View successfully.",
      result: result_project,
    };
    res.json(outputJson);
  });

exports.project_list = async (req, res) => {
  var postData = req.body;
  let where_project = { isDeleted: false };
  let result_project = await ProjectModal.find(where_project);
  outputJson = {
    code: 200,
    status: "Success",
    message: "Project List successfully.",
    result: result_project,
  };
  res.json(outputJson);
};

exports.project_delete = async (req, res) => {
  let cid = ObjectId(req.body._id);
  let where = {};
  where["_id"] = cid;
  try {
    let = result = await ProjectModal.deleteOne(where);
    outputJson = {
      code: 200,
      status: "Success",
      message: "Project Delete successfully.",
      result: result,
    };
    res.json(outputJson);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

// project_by_id

exports.project_by_id = async (req, res) => {
  var postData = req.body;
  let where = { _id: postData._id, isDeleted: false };
  let result = await ProjectModal.findOne(where);
  outputJson = {
    code: 200,
    status: "Success",
    message: "View Project successfully.",
    result: result,
  };
  res.json(outputJson);
};

exports.project_edit = async (req, res) => {
  let obj = {
    name: req.body.name,
    desc: req.body.desc,
    category: req.body.category,
    link: req.body.link,
    image: req.body.image,
    meta_title: req.body.meta_title,
    meta_keywords: req.body.meta_keywords,
    meta_description: req.body.meta_description,
    status: req.body.status,
    project_images: req.body.project_images
  };
  try {
    let result = await ProjectModal.findOneAndUpdate(
      { _id: ObjectId(req.query.id) },
      obj
    );
    outputJson = {
      code: 200,
      status: "Success",
      message: "Update Project successfully.",
      result: result,
    };
    res.json(outputJson);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

exports.all_projects  = async (req, res) => {
  let postData = req.body;
  let limit = postData.limit;
  let page = postData.page || 1;
  let skiprecord = limit * page - limit;
  let where = {};
  //where["isDeleted"] = false;
  let Allprojectsaggregate = [ 
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
	          desc:1,	
            image:1,
	          link:1,
            category:1,
	          status:1,
            meta_title:1,
            meta_keywords:1,
	          meta_description:1,
            isDeleted:1,
            project_images:1
          } 
      },  
  ];
  var all_projects = await ProjectModal.aggregate(
    Allprojectsaggregate
  );
  let totalrecord = await ProjectModal.find({isDeleted: false}).count();
  try
  {
      outputJson   = {
          code: 200, 
          status: "Success",
          message: 'View Projects Successfully',
          result:all_projects,
          page: page,
          limit: limit,
          count: totalrecord,
      };
      res.json(outputJson);
  }
  catch(error)
  {
      outputJson   = {code: 400, status: "Faild",message: 'View Projects Faild'};
      res.json(outputJson);
  }
};


exports.projects_list  = async (req, res) => {
  let postData = req.body;
  let limit = postData.limit;
  let page = postData.page || 1;
  let skiprecord = limit * page - limit;
  let where = {};
  where["status"] = true;
  let Allprojectsaggregate = [ 
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
	          desc:1,	
            image:1,
	          link:1,
            category:1,
	          status:1,
            meta_title:1,
            meta_keywords:1,
	          meta_description:1,
            isDeleted:1,
            project_images:1
          } 
      },  
  ];
  var all_projects = await ProjectModal.aggregate(
    Allprojectsaggregate
  );
  let totalrecord = await ProjectModal.find({isDeleted: false}).count();
  try
  {
      outputJson   = {
          code: 200, 
          status: "Success",
          message: 'View Projects Successfully',
          result:all_projects,
          page: page,
          limit: limit,
          count: totalrecord,
      };
      res.json(outputJson);
  }
  catch(error)
  {
      outputJson   = {code: 400, status: "Faild",message: 'View Projects Faild'};
      res.json(outputJson);
  }
};