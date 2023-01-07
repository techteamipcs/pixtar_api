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
var InviteModal      = require('../../model/invites/Invites');
const moment         = require("moment");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.addblog  = async (req, res) => {

    let where    = {slug:req.body.name.replace(/ /g,"-").toLowerCase(),isDeleted:false}
    let getBlog  = await BlogModal.findOne(where);
    
    let blogSlug;
    if(getBlog)
    {
        blogSlug = req.body.name.replace(/ /g,"-").toLowerCase()+'-1';
    }
    else
    {
        blogSlug = req.body.name.replace(/ /g,"-").toLowerCase();
    }

    // Genrate Virtual Id 
    var blog_name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase();
    var virtual_result = randomstring.generate({length: 6,charset: 'alphanumeric'});
    const bloglins = new BlogModal({
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : req.body.image,
        name : req.body.name,
        category : req.body.blog_category,
        slug : blogSlug,
        author : req.body.author,
        tag_list : req.body.tag,
        content : req.body.content_html,
        content_type : 'HTML',
        video_link : req.body.video_link,
        virtual_id:virtual_result,
        featured : req.body.featured,
    })
    try
    {  
        const blogData = await bloglins.save();   
        outputJson = {code: 200, status: "Success",message: 'Add Blog Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Blog Add Faild'};
        res.json(outputJson);
    }
};

exports.view_blog  = async (req, res) => {
    let postData = req.body;
    let limit = req.body.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
 
    // Popular Articles

    let aggregateQueryRem = [
        { 
            $match:{isDeleted:false,featured:true}  
        },
        {$sort: {_id: -1}},
        { $limit : 10 },
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var popular_articles = await BlogModal.aggregate(
        aggregateQueryRem
    );
    
    // Video Articles
    
    let videoaggregateQueryRem = [
        { 
            $match:{isDeleted:false,category:'2'}  
        },
        {$sort: {_id: -1}},
        { $limit : 5 }, 
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var video_articles = await BlogModal.aggregate(
        videoaggregateQueryRem
    );

    // Recent Articles
    
    let Recentaggregate = [
        { 
            $match:{isDeleted:false}  
        },
        {$sort: {_id: -1}},
        { $limit : 3 },
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var recent_articles = await BlogModal.aggregate(
        Recentaggregate
    );

    // All Articles
    
    let Allarticalaggregate = [
        { 
            $match:where
        },
        {$sort: {_id: -1}},
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
	      category:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var all_articles = await BlogModal.aggregate(
        Allarticalaggregate
    );
    let totalrecord = await BlogModal.find({isDeleted: false}).count();
    try 
    { 
       outputJson = {
                code: 200,
                status: "Success",
                message: "View Blog Successfully",
                all_artical: all_articles,
                popular_articles:popular_articles,
                recent_articles:recent_articles,
                video_articles:video_articles,
                page: page,
                limit: limit,
                count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Blog Faild'};
        res.json(outputJson);
    }
};

exports.view_allblog  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Allarticalaggregate = [
        { 
            $match:where
        },
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
            { $sort: { _id: -1 } },
            { $skip: skiprecord },
            { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var all_articles = await BlogModal.aggregate(
        Allarticalaggregate
    );
    
    let totalrecord = await BlogModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View All Blog Successfully',
                        result: all_articles,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View All Blog Faild'};
        res.json(outputJson);
    }
};

exports.view_allvideoblog  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    where["category"]  = '2';
    let Allarticalaggregate = [
        { 
            $match:where
        },
        {
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
            { $sort: { _id: -1 } },
            { $skip: skiprecord },
            { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var all_articles = await BlogModal.aggregate(
        Allarticalaggregate
    );
    
    let totalrecord = await BlogModal.find({isDeleted: false,category: '2'}).count();
    try
    {  
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View All Video Blog Successfully',
                        result: all_articles,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View All Blog Faild'};
        res.json(outputJson);
    }
};

exports.blog_listing  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Allarticalaggregate = [
        // {  
        //     $match:where
        // },
        {
            $lookup:{
                    from: 'tags',
                    localField: 'tag_list',
                    foreignField: '_id',
                    as: 'tagsdata'
            }
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              isDeleted:1,
              tagsdata:"$tagsdata.name"
            } 
        },  
    ];
    var all_articles = await BlogModal.aggregate(
        Allarticalaggregate
    );
    let totalrecord = await BlogModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View All Blog Successfully',
                        result: all_articles,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                        };
        res.json(outputJson);
    }
    catch(error)
    { 
        outputJson   = {code: 400, status: "Faild",message: 'View All Blog Faild'};
        res.json(outputJson);
    }
};

exports.search_blog  = async (req, res) => {
    var postData = req.body;
    var searchstring = postData.searchstring.toLowerCase();
    let Allarticalaggregate = [
        {  
          $match: {
            "slug": { '$regex': searchstring},
            isDeleted:false
          }
        },
        { 
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {   
            $project: { 
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            } 
        },  
    ];
    var all_articles = await BlogModal.aggregate(
        Allarticalaggregate
    );
    try
    {
        outputJson   = {code: 200, status: "Success",message: 'View All Blog Successfully',result:all_articles};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View All Blog Faild'};
        res.json(outputJson);
    }
};

exports.add_author  = async (req, res) => {
    
    let where      = {slug:req.body.name.replace(/ /g,"-").toLowerCase(),isDeleted:false}
    let getAuthor  = await AuthorModal.findOne(where);
    
    let authorSlug;
    if(getAuthor)
    {
        authorSlug = req.body.name.replace(/ /g,"-").toLowerCase()+'-1';
    }
    else
    {
        authorSlug = req.body.name.replace(/ /g,"-").toLowerCase();
    }
    
    const authorelins = new AuthorModal({ 
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : req.body.image,
        name : req.body.name,
        slug : authorSlug, 
        title : req.body.author_title,
        description : req.body.description,
        facebook_link : req.body.facebook_link,
        twitter_link : req.body.twitter_link,
        youtube_link : req.body.youtube_link,
        instagram_link : req.body.instagram_link,
        linkedin_link : req.body.linkedin_link,
        tiktok_link : req.body.tiktok_link,
        telegram_link : req.body.telegram_link,
    }) 
    try
    {   
        const authorData = await authorelins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Author Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Author Add Faild'};
        res.json(outputJson);
    }
};

exports.view_author  = async (req, res) => { 
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let AllAuthorggregate = [ 
        // {  
        //     $match:where
        // },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              title:1,
              image:1,
              description:1,
              facebook_link:1,
              twitter_link:1,
              youtube_link:1,
              instagram_link:1,
              linkedin_link:1,
              tiktok_link:1,
              telegram_link:1,
              isDeleted:1
            } 
        },  
    ];
    var all_author = await AuthorModal.aggregate(
        AllAuthorggregate
    );
    let totalrecord = await AuthorModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Author Successfully',
            result:all_author,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Author Faild'};
        res.json(outputJson);
    }
};

exports.getAuthorWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await AuthorModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Author List successfully.', result: result};
    res.json(outputJson);
};

exports.editAuthordata = async (req, res) => {
    let where       = {_id:req.query.id}
    let getAuthor   = await AuthorModal.findOne(where); 
    let authorImage;
    if(req.body.image == null)
    {
        authorImage = getAuthor.image
    }
    else
    { 
        authorImage = req.body.image
    }

    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : authorImage,
        name : req.body.name,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(), 
        title : req.body.author_title,
        description : req.body.description,
        facebook_link : req.body.facebook_link,
        twitter_link : req.body.twitter_link,
        youtube_link : req.body.youtube_link,
        instagram_link : req.body.instagram_link,
        linkedin_link : req.body.linkedin_link,
        tiktok_link : req.body.tiktok_link,
        telegram_link : req.body.telegram_link,
        isDeleted: req.body.status,
    } 
    try {
        let result = await AuthorModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Author successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

// Delete Author

exports.deleteauthor = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await AuthorModal.deleteOne({_id:req.body.id});     
        outputJson = { code: 200, status: "Success", message: 'Update Author successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.get_authordetails  = async (req, res) => {
    var postData = req.body;
    let Authoraggregate = [
        {  
            $match:{_id:ObjectId(postData.id),isDeleted:false}  
        },
        {
            $lookup:  {
            from: "blogs",
              let: {   "id": "$_id"   },
              pipeline: [
                  { 
                      $match:{ 
                      $expr:{ 
                          $and: [
                                    {   $eq: [ "$author",  "$$id" ] },
                                    {   $eq: [ "$isDeleted",  false ] }
                                ]
                        },
                    },
                  },
              ],
              as: "blogdata"
            }
        },
        {   
            $project: {    
              _id:1,
              name:1,
              image:1,
              description:1,
              title:1,
              meta_description:1,
              meta_title:1,
              meta_keywords:1,
              blog_data : "$blogdata",
            }  
        },   
    ];
    var author_detail = await AuthorModal.aggregate(
        Authoraggregate
    );

    try 
    {  
       outputJson = {
                code: 200,
                status: "Success",
                message: "View Author Details Successfully",
                results: author_detail[0],
        }; 
        res.json(outputJson);
    }
    catch(error)
    { 
        outputJson   = {code: 400, status: "Faild",message: 'View Author Faild'};
        res.json(outputJson);
    }
};

exports.get_blogdetails  = async (req, res) => {
    var postData = req.body;
    let blogaggregate = [
        {   
            $match:{isDeleted:false}  
        },
        {  
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {
            $lookup:{
                    from: 'tags',
                    localField: 'tag_list',
                    foreignField: '_id',
                    as: 'tagdata'
            }
        },
        {   
            $project: {  
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              video_link:1,
              content:1,
              virtual_id:1,
              meta_description:1,
              meta_title:1,
              meta_keywords:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
              tag_data:"$tagdata"
            } 
        },  
    ];
    var blog_detail = await BlogModal.aggregate(
        blogaggregate
    );
    
    let allBlogaggregate = [
        {   
            $match:{isDeleted:false}  
        },
        {   
            $project: {  
                _id:1,
                slug:1,
                virtual_id:1,
            } 
        },  
    ];

    var allBlog_detail = await BlogModal.aggregate(
        allBlogaggregate
    );

    if(blog_detail != '')
    {
        outputJson = {
            code: 200,
            status: "Success",
            message: "View Blog Details Successfully",
            results: blog_detail,
            blog_result:allBlog_detail
        }; 
        res.json(outputJson); 
    }
    else
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Blog Faild'};
        res.json(outputJson);
    }
};

exports.getblogWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await BlogModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Blog List successfully.', result: result};
    res.json(outputJson);
};

exports.editblogdata = async (req, res) => {
    let where    = {_id:req.query.id}
    let getBlog  = await BlogModal.findOne(where); 
    let blogImage;
    if(req.body.image == null)
    { 
        blogImage = getBlog.image
    }
    else
    { 
        blogImage = req.body.image
    }
    var blog_name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase();
    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : blogImage,
        name : blog_name,
        category : req.body.blog_category,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(),
        tag_list : req.body.tag,
        content : req.body.content_html,
        video_link : req.body.video_link,
        featured : req.body.featured,
        isDeleted: req.body.status,
    }
    try {
        let result = await BlogModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Blog successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.get_nextblogdetail = async (req, res) => {
    var postData = req.body;
    let nxtBlog_detail   = await BlogModal.find({_id: {$lt: postData.id},isDeleted:false}).sort({_id: -1 }).limit(1);
    let prevBlog_detail  = await BlogModal.find({_id: {$gt: postData.id},isDeleted:false}).sort({_id: 1 }).limit(1); 

    if(nxtBlog_detail != '' || prevBlog_detail != '')
    {
        outputJson = {
            code: 200,
            status: "Success",
            message: "View Blog Details Successfully",
            nxtBlog_detail: nxtBlog_detail,
            prevBlog_detail: prevBlog_detail
        }; 
        res.json(outputJson); 
    }
    else
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Blog Faild'};
        res.json(outputJson);
    }
};

// Delete Blog

exports.deleteblog = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await BlogModal.deleteOne({_id:req.body.id});     
        outputJson = { code: 200, status: "Success", message: 'Update Blog successfully.', result: result};
        res.json(outputJson);
    }catch (error) { 
        res.status(400).json(failAction(error.message));
    }
};

exports.add_tag  = async (req, res) => {
  
    const tagExists = await TagModal.findOne({
        name : req.body.name
    });

    if(tagExists)
    {  
        outputJson     = {code: 400, status: "error", message: 'Tag Name Already Exists'};
        return res.json(outputJson);
    }

    const taglins = new TagModal({   
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : req.body.image,
        name : req.body.name,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(),  
        description : req.body.description,
    }) 
    try
    {   
        const tagData = await taglins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Tag Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Tag Add Faild'};
        res.json(outputJson);
    }
};

exports.getTagWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await TagModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Tag List successfully.', result: result};
    res.json(outputJson);
};

exports.editTagdata = async (req, res) => {
    let where    = {_id:req.query.id}
    let getTag   = await TagModal.findOne(where); 
    let tagImage;
    if(req.body.image == null)
    {
        tagImage = getTag.image
    }
    else
    { 
        tagImage = req.body.image
    }
    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : tagImage,
        name : req.body.name,
        slug : req.body.name.replace(/ /g,"-").toLowerCase(),
        description : req.body.description,
        isDeleted: req.body.status, 
    }
    try {
        let result = await TagModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Tag successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};


exports.view_tag  = async (req, res) => {
    let show_tag  = await TagModal.find({isDeleted: false});
    try
    {
        outputJson   = {code: 200, status: "Success",message: 'View Tag Successfully',result:show_tag};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Tag Faild'};
        res.json(outputJson);
    }
};

exports.adminsidetags  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Alltagaggregate = [
        // {  
        //     $match:where
        // },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              image:1,
              description:1,
              isDeleted:1,
            } 
        },  
    ];
    var all_tag = await TagModal.aggregate(
        Alltagaggregate
    );
    let totalrecord = await TagModal.find({isDeleted: false}).count();

    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View Tag Successfully',
                        result:all_tag,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                    };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Tag Faild'};
        res.json(outputJson);
    }
};

// Delete Tag

exports.deletetag = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await TagModal.deleteOne({_id:req.body.id});     
        outputJson = { code: 200, status: "Success", message: 'Update Tag successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};


exports.get_tagblog  = async (req, res) => { 
    var postData = req.body;
    let Authoraggregate = [
        {  
            $match:{isDeleted:false,"tag_list" : {$in: [ ObjectId(postData.id)] }}  
        },
        {$sort: {_id: -1}},
        {  
            $lookup:{ 
                    from: 'tags', 
                    localField: 'tag_list', 
                    foreignField: '_id',
                    as: 'tagdata'
            }
        },
        { 
            $lookup:{
                    from: 'authors',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorsdata'
            }
        },
        {   
            $project: {   
              _id:1,
              name:1,
              created_at: 1,
              image:1,
              featured:1,
              slug:1,
              virtual_id:1,
              author_id: "$authorsdata._id",
              author_slug: "$authorsdata.slug",
              author_name: "$authorsdata.name",
              author_title:"$authorsdata.title",
              author_image: "$authorsdata.image",
            }  
        },  
    ];
    var blog_detail = await BlogModal.aggregate(
        Authoraggregate
    );
    
    let where_tags   = {_id:ObjectId(postData.id),isDeleted: false}
    let result_tags  = await TagModal.findOne(where_tags);

    try 
    {  
       outputJson = {
                code: 200,
                status: "Success",
                message: "View Blog Data Successfully",
                results: blog_detail,
                result_tags: result_tags,
        }; 
        res.json(outputJson);
    }
    catch(error)
    { 
        outputJson   = {code: 400, status: "Faild",message: 'View Blog data'};
        res.json(outputJson);
    }
};

exports.add_comment  = async (req, res) => {
    
    const commentlins = new CommentModal({     
        votes : req.body.votes,
        name : req.body.name,
        email : req.body.email,  
        mobile : req.body.mobile,
        content : req.body.content,
        post: req.body.post
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
    let show_comment  = await CommentModal.find();
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

exports.getblogcomment  = async (req, res) => {
    var postData = req.body;

    let where_blog   = {_id:ObjectId(postData.id),isDeleted: false}
    let result_blog  = await BlogModal.findOne(where_blog);

	let where    = {post:postData.id,isDeleted:false}
    let result   = await CommentModal.find(where); 
    outputJson   = { code: 200, status: "Success", message: 'Comment List successfully.', result: result,result_blog:result_blog};
    res.json(outputJson);
};

exports.deletecomment = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try {  
        let result = await CommentModal.findOneAndUpdate(where, {
        isDeleted: true,
        });     
        outputJson = { code: 200, status: "Success", message: 'Update Comment successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.add_invite  = async (req, res) => {
  
    var invite_exist_email = null;
    var isExisted = false;
    
    if(req.body.email){
        invite_exist_email = await InviteModal.findOne({
            email : req.body.email
        });
    }

    if(invite_exist_email){
        isExisted = true;
    }

    if(isExisted){  
        if((invite_exist_email && invite_exist_email.isDeleted == true)){
            let obj = {
                isDeleted : false,
                name: req.body.name,
                email: req.body.email,
                updated_at : Date.now()
            }
            try {
                let resultemail = await InviteModal.findOneAndUpdate(
                    {email: req.body.email },
                    obj
                );
                outputJson = { code: 200, status: "Success", message: 'Thank you For sharing Email with us.'};
                res.json(outputJson);
            } catch (error) {
                res.status(400).json(failAction(error.message));
            }
        } else {
            if(req.body.mobile){
                outputJson     = {code: 400, status: "error", message: 'You\'ve already entered this email before'};
            }
            return res.json(outputJson);
        }
    } else {
        const invite = new InviteModal({   
            name : req.body.name,
            email: req.body.email
        }) 
        try
        {   
            const inviteData = await invite.save();
            outputJson = {code: 200, status: "Success",message: 'Thank you For sharing Details with us'};
            res.json(outputJson);
        }
        catch(error)
        {
            outputJson     = {code: 400, status: "Faild",message: 'Mobile Number Add Faild'};
            res.json(outputJson);
        }
    }
};

exports.adminsideinvite  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let Alltagaggregate = [
        
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              name:1,
              email:1,
              created_at:1,
              updated_at:1,
              isDeleted:1,
            } 
        },  
    ];
    var all_invite = await InviteModal.aggregate(
        Alltagaggregate
    );
    let totalrecord = await InviteModal.find({isDeleted: false}).count();
    if(all_invite && all_invite.length > 0){
        all_invite.forEach(invite => {
            invite.created_at = moment(invite.created_at).format('YYYY-MM-DD HH:MM');
            invite.updated_at = moment(invite.updated_at).format('YYYY-MM-DD HH:MM');
        });
    }
    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View Invites Successfully',
                        result:all_invite,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                    };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Tag Faild'};
        res.json(outputJson);
    }
};

// Delete Invite

exports.deleteinvite = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await InviteModal.deleteOne({_id:req.body.id});     
        outputJson = { code: 200, status: "Success", message: 'Update Invites successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.view_invites  = async (req, res) => {
    let show_tag  = await InviteModal.find({isDeleted: false});
    try
    {
        outputJson   = {code: 200, status: "Success",message: 'View Invites Successfully',result:show_tag};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Invites Faild'};
        res.json(outputJson);
    }
};

exports.editInvitesdata = async (req, res) => {
    let obj = {
        name : req.body.name,
        isDeleted : req.body.isDeleted,
        email: req.body.email,
        updated_at : Date.now()
    }
    try {
        let result = await InviteModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Invites successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.get_invite  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await InviteModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Invites List successfully.', result: result};
    res.json(outputJson);
};

exports.downloadinvites = async (req, res, next) => {
    try {
        let data = await InviteModal.find({});
        if (data.length > 0) {
            var csvname = Date.now() + "_invites.csv"
            var header = ['_id', 'mobile', 'isDeleted', 'created_at', 'updated_at']
            var file = __dirname + '/../../public/invites/' + csvname;
            var filepath = process.env.URL + 'public/invites/' + csvname;
            if(data && data.length > 0){
                data.forEach(invite => {
                    invite.created_at = moment(invite.created_at).format('YYYY-MM-DD HH:MM');
                    invite.updated_at = moment(invite.updated_at).format('YYYY-MM-DD HH:MM');
                });
            }
            const csvWriter = createCsvWriter({
                path: file,
                header: [{
                        id: "_id",
                        title: "_id"
                    },
                    {
                        id: "name",
                        title: "name"
                    },
                    {
                        id: "email",
                        title: "email"
                    },
                    {
                        id: "isDeleted",
                        title: "isDeleted"
                    },
                    {
                        id: "created_at",
                        title: "created_at"
                    },
                    {
                        id: "updated_at",
                        title: "updated_at"
                    }
                ]
            });
            csvWriter
                .writeRecords(data)
                .then(() =>
                    // console.log('path'+file)
                    res.json({
                        success: true,
                        statuscode: 200,
                        message: '',
                        header: header,
                        csvname: csvname,
                        item: data,
                        filepath: filepath
                    })
                );

        } else {
            res.json({
                success: false,
                statuscode: 404,
                message: 'Record Not Found'
            })
        }
    } catch (err) {
        err.name = 'download Error';
        next(err);
    }
}
