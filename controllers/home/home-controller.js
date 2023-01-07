const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var path 		     = require('path');
const nodemailer     = require("nodemailer");
const { ObjectId }   = require('bson');
var builder          = require('xmlbuilder');
var fs               = require('fs');
const dotenv         = require("dotenv");
const hbs = require('nodemailer-express-handlebars');

const moment         = require("moment");

var TestimonialModal = require('../../model/home/Testimonial');
var PageModal        = require('../../model/page/Page');
var HomePageModal    = require('../../model/page/Home_Page');
var AboutNoticeModal = require('../../model/page/About_Notice');
var ProgramModal     = require('../../model/influencer-program/Influencer-program');
var DownloadModal    = require('../../model/download/Download');
var ContactModal     = require('../../model/contact/Contact');
var BlogModal        = require('../../model/blog/Blog');
var AuthorModal      = require('../../model/blog/Author');
var TagModal         = require('../../model/blog/Tag');
var CareerModal      = require('../../model/career/Career');
var UserModal      = require('../../model/others/User');
var ProjectModal      = require('../../model/project/Project');

exports.pixtarxml  = async (req, res) => { 
    var xml         = builder.create('urlset');
    xml.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    let totalBlog   = await BlogModal.find({isDeleted: false});
    let totalPage   = await PageModal.find({isDeleted: false});
    let totalTag    = await TagModal.find({isDeleted: false});
    let totalauthor = await AuthorModal.find({isDeleted: false});
    let base_url = 'http://5.161.96.184/#';

    // All Page 
    for(let p = 0; p < totalPage.length; p++)
    {
        let page_url;
        if(totalPage[p].page_name == 'home'){ page_url = base_url; }
        else if(totalPage[p].page_name == 'blog'){ page_url = base_url+'/blog'; }
        else if(totalPage[p].page_name == 'problem'){ page_url = base_url+'/problem'; }
        else if(totalPage[p].page_name == 'solution'){ page_url = base_url+'/solution'; }
        else if(totalPage[p].page_name == 'contact-us'){ page_url = base_url+'/contact-us'; }
        else if(totalPage[p].page_name == 'about-us'){ page_url = base_url+'/about-us'; }
        else if(totalPage[p].page_name == 'career'){ page_url =  base_url+'/career'; }
        else if(totalPage[p].page_name == 'terms-conditions'){ page_url =  base_url+'/terms-conditions'; }
        else if(totalPage[p].page_name == 'privacy-policy'){ page_url =  base_url+'/privacy-policy'; }
        
        let page_update = moment(totalPage[p].updated_at).format('YYYY-MM-DD');
        xml.ele('url')
        .ele('loc',page_url).up()
        .ele('lastmod', page_update).up()
        .ele('changefreq','monthly').up()
        .ele('priority','1.0').up().end();
    }

    // Single Blog Url 
    for(let i = 0; i < totalBlog.length; i++)
    { 
        var blog_url    = base_url+'/blog/'+totalBlog[i].slug+'/'+totalBlog[i].virtual_id 
        let update_date = moment(totalBlog[i].updated_at).format('YYYY-MM-DD');
        xml.ele('url')
        .ele('loc',blog_url).up()
        .ele('lastmod', update_date).up()
        .ele('changefreq','monthly').up()
        .ele('priority','1.0').up().end();
    }

    var dirPath = process.env.XML_PATH_URL
    var xmldoc  = xml.toString({ pretty: true }); 
    fs.writeFile(dirPath, xmldoc, function(err) {
        if(err){ 
            return console.log(err); 
        } 
        outputJson = {code: 200, status: "Success",message: 'The file was saved!',result:xmldoc};
        res.json(outputJson);
    });  
  };

  exports.view_dashboard = async (req, res) => {
    var postData = req.body;
    let where = { isDeleted: false };
  
    let totalpage = 0;
    let totalblog = 0;
    let totaltag = 0;
    let totalauthor = 0;
    let totaltestimonial = 0;
    let totalprogram = 0;
    let totalcontact = 0;
    let totalcareer = 0;
    let totalusers = 0;
    let totalprojects = 0;
  
    let where_page = { isDeleted: false };
    totalpage = await PageModal.find(where_page).count();
  
    let where_blog = { isDeleted: false };
    totalblog = await BlogModal.find(where_blog).count();
  
    let where_tag = { isDeleted: false };
    totaltag = await TagModal.find(where_tag).count();
  
    let where_author = { isDeleted: false };
    totalauthor = await AuthorModal.find(where_author).count();
  
    let where_testimonial = { isDeleted: false };
    totaltestimonial = await TestimonialModal.find(where_testimonial).count();
  
    let where_program = { isDeleted: false };
    totalprogram = await ProgramModal.find(where_program).count();
  
    let where_contact = { isDeleted: false };
    totalcontact = await ContactModal.find(where_contact).count();
  
    let where_career = { isDeleted: false };
    totalcareer = await CareerModal.find(where_career).count();

    let where_user = { isDeleted: false };
    totalusers = await UserModal.find(where_user).count();

    let where_projects = { isDeleted: false };
    totalprojects = await ProjectModal.find(where_projects).count();

    try {
      outputJson = {
        count_page: totalpage,
        count_blog: totalblog,
        count_tag: totaltag,
        count_author: totalauthor,
        count_testimonial: totaltestimonial,
        count_program: totalprogram,
        count_contact: totalcontact,
        count_career: totalcareer,
        count_user: totalusers,
        count_projects: totalprojects,
        code: 200,
        status: "Success",
        message: "View Dashboard Successfully",
      };
      res.json(outputJson);
    } catch (error) {
      outputJson = { code: 400, status: "Faild", message: "PageData Add Faild" };
      res.json(outputJson);
    }
  };

exports.addpagedata = async (req, res) => {
    
    const pageins = new PageModal({
        page_name : req.body.page_name,
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
    })
    try
    { 
        const PageData = await pageins.save();
        outputJson         = {code: 200, status: "Success",message: 'PageData Add Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'PageData Add Faild'};
        res.json(outputJson);
    }
};

exports.add_contact = async (req, res) => {
    const contact = new ContactModal({
        name : req.body.name,
        email : req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message : req.body.message,
    })
    try
    {
        const contactdata = await contact.save();
        outputJson     = {code: 200, status: "Success",message: 'Message Send Successfully'};

        // Register Send Mail 

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER, 
                pass: process.env.GMAIL_PASSWORD
            } 
        });
        
        // point to the template folder
          const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./templates-email'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./templates-email'),
          };

          // use a template file with nodemailer
          transporter.use('compile', hbs(handlebarOptions))

        var body ='<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Welcome</title><style type="text/css">p {  margin-bottom:10px; line-height:22px; margin-top:0; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; font-size:14px;}span {  font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}a { color:#fb3544;  text-decoration:; font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}body{background-color:#F3F3F3;}.bgBody { background:#F3F3F3;}.bgItem { background:#fff;}.bgBody, .bgBody td, table, table td, td { border-spacing: 0px !important; border:0 !important;  border: !important; border-collapse: collapse !important;} @media only screen and (max-width:480px) { table[class="MainContainer"], td[class="cell"] { width: 100% !important; height:auto !important;}td[class="specbundle"] { width: 100% !important; float:left !important; font-size:13px !important; line-height:17px !important; display:block !important; padding-bottom:15px !important;}td[class="specbundle2"] { width:90% !important; float:left !important; font-size:14px !important; line-height:18px !important; display:block !important; padding-left:5% !important; padding-right:5% !important;} td[class="specbundle3"], td[class="full"] { width:90% !important; float:left !important; font-size:14px !important; line-height:18px !important; display:block !important; padding-left:5% !important; padding-right:5% !important; padding-bottom:20px !important;}td[class="spechide"] { display: !important;} img[class="banner"] { width: 100% !important; height: auto !important;} td[class="left_pad"] { padding-left:15px !important; padding-right:15px !important;}#padd0, #padd1{padding-bottom:0 !important;margin-top:-1px}}@media only screen and (max-width:680px) { table[class="MainContainer"], td[class="cell"] { width: 100% !important; height:auto !important;}td[class="specbundle"] { width: 100% !important; float:left !important; font-size:13px !important; line-height:17px !important; display:block !important; padding-bottom:15px !important;}td[class="specbundle2"] { width:90% !important; float:left !important; font-size:14px !important; line-height:18px !important; display:block !important; padding-left:5% !important; padding-right:5% !important;} td[class="specbundle3"] { width:90% !important; float:left !important; font-size:14px !important; line-height:18px !important; display:block !important; padding-left:5% !important; padding-right:5% !important; padding-bottom:20px !important;} td[class="spechide"] { display: !important;} img[class="banner"] { width: 100% !important; height: auto !important;} td[class="left_pad"] { padding-left:15px !important; padding-right:15px !important;} .font { font-size:22px !important; line-height:26px !important;}}.order_box {  border-radius: 8px;  color: #fff;  margin: 5px;  min-height: 90px;  font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}.padd15 td{padding: 6px;}.order_box h1 {  font-size: 14px;  margin: 0 0 20px;  padding: 0;  text-transform: uppercase;  line-height:1.1;  font-weight:500;  text-align:left;}.order_box img {  margin: 0 10px 0 0;  vertical-align: middle;}.order_box h2 {  font-size: 17px;  font-weight: 700;  line-height: 35px;  margin: 0;  padding: 0;  text-align: right;}.order_box.yellow {  background-color: #f9bf3b;}.order_box.purple {  background-color: #3c497f;}.order_box.red {  background-color: #f15d5d;}.card .col-lg-3{width:50%;float:left;}.title {  border-bottom: 2px solid #00a952;  text-transform: uppercase;}.maillist {  float: right;  list-style: outside  ;  margin: 0;  padding: 0;}.maillist li {  color: #6e8091;  display: inline-block;  font-size: 16px;  margin: 0 5px;}.maillist li a {  border-radius: 8px;  color: #6e8091;  font-weight: 700;  padding: 6px 16px;}.maillist li a:hover, .maillist li a.active {  background: #00a952  repeat scroll 0 0;  color: #fff;  text-decoration: ;}.title img {  margin: 0 10px 0 0;  vertical-align: middle;}.tab-content {  font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}.tab-content > .active {  display: block;  visibility: visible;}.table2 {  color: #6e8091;  font-size: 14px;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;}.table2 td {  border-top: 1px solid #ecf1f7 !important;  padding: 15px;  text-align: left;  vertical-align: top;}.tab-content th, .tab-content td {  padding: 15px 10px 15px 20px;}.tab-content td {  border-bottom: 1px solid #f1f5f9 !important;  color: #6e8091;}.table2 td img {  float: left;  height: 60px;  margin-left: 2px;  width: 60px;}.tab-content td:last-child, .table2 td:last-child {  text-align: right;}.tasktable{margin:10px 0;}.tasktable th, .tasktable td{border:1px solid #ccc !important; font-family:Helvetica,Arial,sans-serif; font-size: 14px; vertical-align: top;}@media only screen and (max-width:500px) {.overflow{overflow-x:auto}}@media only screen and (max-width:470px) {.card .col-lg-3{width:100%;}.table2 td { padding: 7px;}.table2 {font-size: 9px;}.title {font-size: 15px;}.maillist li {font-size: 14px; margin: 5px 5px 0;}.maillist li a {padding: 6px 10px;}} </style></head><body style="margin:0;"><table cellpadding="0" cellspacing="0" border="0" width="100%" class="bgBody" align="center">  <!--content starting-->  <tr>    <td><table width="670" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" bgcolor="#ffffff">   <tr><td class="movableContentContainer" style="font-size:16px; line-height:24px; ">  <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">    <table width="100%" border="0" cellspacing="0" cellpadding="0"  class="bgBody"> <tbody>   <tr><td colspan="2" height="40"></td>   </tr>   <tr><td colspan="3" align="center"><span style="line-height: 20px; font-size: 10px;  text-align: center; padding-bottom: 10px;"> <a href="javascript:;"></a>&nbsp;</span></td>   </tr> </tbody>    </table>  </div>  <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">    <table width="100%" border="0" cellspacing="0" cellpadding="0"  class="bgBody"> <tbody>   <tr  bgcolor="#ffffff"><td colspan="2" height="40"></td>   </tr>   <tr  bgcolor="#ffffff"><td colspan="3"><h1 style="font-family: Helvetica,Arial,sans-serif; font-weight: bold; padding: 0px; margin: 0px; line-height: 43px; text-align: center; color: #08bf6e; font-size: 35px;"> Hi '+req.body.name+'! </h1>  <br>  <div style="background-color:#e7e7e7;height:4px;width:70px;margin:0 auto;text-align:center;"></div>  <br>';

            body += '<p style="font-family:Helvetica,Arial,sans-serif;color:#4f4f4f;font-size:16px;font-weight:600;line-height:20px;padding:0;margin:0 10px 10px;text-align:left;"></p>';

            body += '<table class="tasktable" width="100%" border="1" bordercolor="#ccc" cellspacing="0" cellpadding="5" bgcolor="#f9f9f9">';
            body += '	<tbody>';
            body += '   <tr>';
            body += '   <th>name</th>';
            body += '   <th>email</th>';
            body += '   <th>message</th>';
            body += '   </tr>';

            body += ' <tr>';
            body += ' <td style="text-align:center;">'+req.body.name+'</td>';
            body += '    <td style="text-align:center;">'+req.body.email+'</td>';
            body += '    <td style="text-align:center;">'+req.body.message+'</td>';
            body += ' </tr> ';
            
            body += '    </tbody>';
            body += '</table>';
            body += '<p style="height:10px;"></p> ';
            body += '<p style="font-family:Helvetica,Arial,sans-serif;color:#4f4f4f;font-size:16px;font-weight:600;line-height:20px;padding:0;margin:0 10px;text-align:left;">Best Regards,</p> ';
            body += '<p style="font-family:Helvetica,Arial,sans-serif;color:#4f4f4f;font-size:16px;font-weight:600;line-height:20px;padding:0;margin:0 10px;text-align:left;">www.pixtar.in</p> ';
            body += '<p style="height:20px;"></p> ';

        const mailOptions  = {
            from : process.env.GMAIL_USER,
            to   :  process.env.ADMIN_MAIL,
            subject : 'Website Enquiry',
            // html : body
            template: 'contact', // the name of the template file i.e email.handlebars
            context:{
                name : req.body.name,
                email : req.body.email,
                message : req.body.message,
                phone: req.body.phone,
        				subject: req.body.subject,
            }
        };
         transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                return res.send("Mail Send Succesfully");
            }
        });
        res.json(outputJson);
    }
    catch(error)
    {
        res.status(400).send(error);
    } 
};

exports.view_page  = async (req, res) => {
    let postData = req.body;
    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let AllPageggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              page_name:1,
              meta_title:1,
              meta_keywords:1,
              meta_description:1,
            } 
        },  
    ];
    var all_page = await PageModal.aggregate(
        AllPageggregate
    );
    let totalrecord = await PageModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Page Successfully',
            result:all_page,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Page Faild'};
        res.json(outputJson);
    }
};

exports.getPageWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await PageModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Page List successfully.', result: result};
    res.json(outputJson);
};

exports.view_homepage  = async (req, res) => {
    var postData = req.body;
	let where    = {isDeleted:false}
    let result   = await HomePageModal.find(where); 
    outputJson   = { code: 200, status: "Success", message: 'Home Page List successfully.', result: result};
    res.json(outputJson);
};

exports.getHomePageWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await HomePageModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Home Page List successfully.', result: result};
    res.json(outputJson);
};

exports.gethomepagewithName  = async (req, res) => {
    var postData = req.body;
	let where    = {page_name:postData.pageName,isDeleted:false}
    let result   = await HomePageModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Home Page List successfully.', result: result};
    res.json(outputJson);
};

exports.addHomepagedata = async (req, res) => {
    var postData = req.body;
    const pageins = new HomePageModal({
        page_name : req.body.name,
        global_spot_league: postData.global_spot_league,
        top_league_title1: postData.top_league_title1, 
        top_league_description1: postData.top_league_description1,
        top_league_title2: postData.top_league_title2, 
        top_league_description2: postData.top_league_description2,
        top_league_title3: postData.top_league_title3, 
        top_league_description3: postData.top_league_description3,
        top_league_title4: postData.top_league_title4, 
        top_league_description4: postData.top_league_description4,
        top_league_title5: postData.top_league_title5, 
        top_league_description5: postData.top_league_description5,
        active_user: postData.active_user,
        download: postData.download,
        winning_credit: postData.winning_credit, 
        meta_description : postData.meta_description,
        meta_title: postData.meta_title,
        meta_keywords : postData.meta_keywords
    })
    try
    { 
        const PageData = await pageins.save();
        outputJson         = {code: 200, status: "Success",message: 'Home Page Data Add Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        console.log(error);
        outputJson     = {code: 400, status: "Faild",message: 'Home Page Data Add Faild'};
        res.json(outputJson);
    }
};

exports.editHomePagedata = async (req, res) => {
    var postData = req.body;
    let obj = {
        page_name : req.body.name,
        global_spot_league: postData.global_spot_league,
        top_league_title1: postData.top_league_title1, 
        top_league_description1: postData.top_league_description1,
        top_league_title2: postData.top_league_title2, 
        top_league_description2: postData.top_league_description2,
        top_league_title3: postData.top_league_title3, 
        top_league_description3: postData.top_league_description3,
        top_league_title4: postData.top_league_title4, 
        top_league_description4: postData.top_league_description4,
        top_league_title5: postData.top_league_title5, 
        top_league_description5: postData.top_league_description5,
        active_user: postData.active_user,
        total_active_user: postData.total_active_user,
        download: postData.download,
        total_download: postData.total_download,
        winning_credit: postData.winning_credit,
        total_winning_credit: postData.total_winning_credit, 
        meta_description : postData.meta_description,
        meta_title: postData.meta_title,
        meta_keywords : postData.meta_keywords
        
    }
    try {
        let result = await HomePageModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Home Page successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.add_aboutnoticed = async (req, res) => {
    var postData = req.body;
    const pageins = new AboutNoticeModal({
        name : postData.name,
        image: postData.image,
        description: postData.description,
        read_link: postData.read_link,
    })
    try
    { 
        const PageData = await pageins.save();
        outputJson         = {code: 200, status: "Success",message: 'About Notice Data Add Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        console.log(error);
        outputJson     = {code: 400, status: "Faild",message: 'About Notice Data Add Faild'};
        res.json(outputJson);
    }
};

exports.editAboutNoticedata = async (req, res) => {
    var postData = req.body;
    let where       = {_id:req.query.id}
    let getAbout    = await AboutNoticeModal.findOne(where); 
    let noticeImage;
    if(postData.image == null)
    {
        noticeImage = getAbout.image
    }
    else
    { 
        noticeImage = postData.image
    }

    let obj = {
        name : postData.name,
        image: noticeImage,
        description: postData.description,
        read_link: postData.read_link,
        isDeleted: postData.status,
    }
    try {
        let result = await AboutNoticeModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update About Notice successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getAboutNoticeWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await AboutNoticeModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'About Notice successfully.', result: result};
    res.json(outputJson);
};

exports.getAboutNoticeDetails  = async (req, res) => {
    var postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    //where["isDeleted"] = false;
    let AllPageggregate = [ 
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
              image:1,
              description:1,
              read_link:1,
              isDeleted:1
            } 
        },  
    ];
    var all_page = await AboutNoticeModal.aggregate(
        AllPageggregate
    );
    let totalrecord = await AboutNoticeModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View About Notice Successfully',
            result:all_page,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View View About Notice Faild'};
        res.json(outputJson);
    }
};

exports.frountAboutNoticeDetails  = async (req, res) => {
    var postData = req.body;
    let limit = 4;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let AllPageggregate = [ 
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
              image:1,
              description:1,
              read_link:1,
            } 
        },  
    ];
    var all_page = await AboutNoticeModal.aggregate(
        AllPageggregate
    );
    let totalrecord = await AboutNoticeModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View About Notice Successfully',
            result:all_page,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View View About Notice Faild'};
        res.json(outputJson);
    }
};

exports.deleteNotice = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await AboutNoticeModal.findOneAndUpdate(where, {
        isDeleted: true,
        });     
        outputJson = { code: 200, status: "Success", message: 'Update About Notice successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getpagewithName  = async (req, res) => {
    var postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    where["page_name"] = postData.pageName;
    let Allpageaggregate = [
        {  
            $match:where
        },
        {   
            $project: {
              _id:0, 
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
            } 
        },  
    ];
    var all_page = await PageModal.aggregate(
        Allpageaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'Page List successfully.',
            result:all_page[0],
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Page List Faild'};
        res.json(outputJson);
    }
};

exports.editPagedata = async (req, res) => {
    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        page_name : req.body.page_name,
    }
    try {
        let result = await PageModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Page successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.addprogram  = async (req, res) => {
    const programlins = new ProgramModal({
        name : req.body.name,
        email : req.body.email,
        mobile : req.body.mobile,
        instagram : req.body.instagram,
        facebook : req.body.facebook,
        twitter : req.body.twitter,
        youtube : req.body.youtube,
        message : req.body.message,
    })
    try
    {  
        const programData = await programlins.save();   
        outputJson = {code: 200, status: "Success",message: 'Add Program Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Program Add Faild'};
        res.json(outputJson);
    }
};

exports.viewinfluencer  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let AllProgramaggregate = [ 
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
              email:1,
              mobile:1,
              instagram:1,
              facebook:1,
              twitter:1,
              youtube:1,
              message:1,
            } 
        },  
    ];
    var all_Program = await ProgramModal.aggregate(
        AllProgramaggregate
    );
    let totalrecord = await ProgramModal.find({isDeleted: false}).count();
    try
    { 
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Influencer Successfully',
            result:all_Program,
            page: page,
            limit: limit,
            count: totalrecord,
        }; 
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Influencer Faild'};
        res.json(outputJson);
    }
};

exports.add_testimonial = async (req, res) => {
    
    const testimoniallins = new TestimonialModal({
        image : req.body.image,
        name : req.body.name,
        location : req.body.location,
        title : req.body.title,
        text : req.body.text,
        featured : req.body.featured,
        job : req.body.job,
    })
    try
    {
        const TestimoniallData = await testimoniallins.save();
        outputJson         = {code: 200, status: "Success",message: 'Tesimonial Add Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Tesimonial Add Faild'};
        res.json(outputJson);
    }
};

exports.editTestimonialdata = async (req, res) => {
    let where    = {_id:req.query.id}
    let getTestimonial  = await TestimonialModal.findOne(where); 
    let ImageName;
    if(req.body.image == null)
    { 
        ImageName = getTestimonial.image
    }
    else
    { 
        ImageName = req.body.image
    }
    let obj = {
        image : ImageName,
        name : req.body.name,
        location : req.body.location,
        title : req.body.title,
        text : req.body.text,
        featured : req.body.featured,
        isDeleted : req.body.status,
        job : req.body.job,
    }
    try {
        let result = await TestimonialModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Testimonial successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getTestimonialWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id}
    let result   = await TestimonialModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Testimonial List successfully.', result: result};
    res.json(outputJson);
};

exports.view_testimonial  = async (req, res) => {
    let where = {};
    where["isDeleted"] = false;
    let Testimonialaggregate = [
        {  
            $match:where
        },
        { $limit: 3 },
        {   
            $project: { 
              _id:1,
              name:1,
              location:1,
              text:1,
              title:1,
              image:1,
            } 
        },  
    ];
    var show_testimonial = await TestimonialModal.aggregate(
        Testimonialaggregate
    );
    try
    {
        outputJson         = {code: 200, status: "Success",message: 'View Tesimonial Successfully',testimonialData:show_testimonial};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'View Tesimonial Faild'};
        res.json(outputJson);
    }
};

exports.all_testimonial  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    let Alltestimonialaggregate = [ 
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
              image:1,
              title:1,
              location:1,
              text:1,
              isDeleted:1
            } 
        },  
    ];
    var all_testimonial = await TestimonialModal.aggregate(
        Alltestimonialaggregate
    );
    let totalrecord = await TestimonialModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Tesimonial Successfully',
            result:all_testimonial,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Tesimonial Faild'};
        res.json(outputJson);
    }
};

exports.all_contact  = async (req, res) => {
    let postData = req.body;
    let limit = 9;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Allcontactaggregate = [
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
              email:1,
              phone:1,
              subject:1,
              message:1,
            } 
        },  
    ];
    var all_contact = await ContactModal.aggregate(
        Allcontactaggregate
    );
    let totalrecord = await ContactModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Contact Successfully',
            result:all_contact,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Contact Faild'};
        res.json(outputJson);
    }
};

exports.deletecontact = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    try { 
        let remove_contact = await ContactModal.deleteOne({_id:cid})
        outputJson = { code: 200, status: "Success", message: 'Contact Remove successfully.'};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
    
};

exports.deleteprogram = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    try {  
        let remove_program = await ProgramModal.deleteOne({_id:cid})
        outputJson = { code: 200, status: "Success", message: 'Program Remove successfully.'};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
    
};

// Delete Testimonial

exports.deleteTestimonial = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await TestimonialModal.deleteOne({_id:cid});     
        outputJson = { code: 200, status: "Success", message: 'Update Tesimonial successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.download_file  = async (req, res) => {  
    let show_download  = await DownloadModal.find();
    try
    {
        outputJson         = {code: 200, status: "Success",message: 'View Download file Successfully',result:show_download};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'View Download Faild'};
        res.json(outputJson);
    }
};

exports.upload_image = async(req, res) => {

    //get post value
    var postData = req.body;
    var d = new Date();
    var n = d.getTime();

    var mv = require('mv');

    //get post value   
    var myfilenme = 'blog-' + n + '-' + req.files[0].originalname;
    var file      = __dirname + '/../../public/' + myfilenme
    var save_file_name = 'public/' + myfilenme;

    mv(req.files[0].path, file, function (err) {
        if (err){ 
            res.status(400).send({ success: 0, msg: "Error to upload file!", data: { err: err } });
        } else {
            outputJson  = {code: 200, status: "success", result:myfilenme};
            return res.json(outputJson);  
        }
    });
};

exports.upload_newfile = async(req, res) => {

    //get post value
    var postData = req.body;
    var d = new Date();
    var n = d.getTime();

    var mv = require('mv');

    //get post value   
    var myfilenme = req.files[0].originalname;
    var file      = process.env.ROBOT_UPLOAD_PATH+''+ myfilenme
    var save_file_name = 'public/' + myfilenme;

    mv(req.files[0].path, file, function (err) {
        if (err){ 
            res.status(400).send({ success: 0, msg: "Error to upload file!", data: { err: err } });
        } else {
            outputJson  = {code: 200, status: "success", result:myfilenme,message: "File Upload Successfully"};
            return res.json(outputJson);  
        }
    });
};

