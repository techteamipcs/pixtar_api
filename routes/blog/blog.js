const express     = require('express')
const router      = express.Router()
const auth        = require("../../middleware/auth");
const customerObj = require('../../controllers/blog/blog-controller');

// Blog Api
router.post('/addblog',auth,customerObj.addblog);
router.post('/viewblog',customerObj.view_blog);
router.post('/allblog',customerObj.view_allblog);
router.post('/allvideoblog',customerObj.view_allvideoblog);
router.post('/searchblog',customerObj.search_blog);
router.post('/blogdetail',customerObj.get_blogdetails);
router.post('/nextblogdetail',customerObj.get_nextblogdetail);
router.post('/deleteblog',auth,customerObj.deleteblog);

// Athor Api
router.post('/addauthor',auth,customerObj.add_author);
router.post('/viewauthor',auth,customerObj.view_author);
router.post('/authordetails',customerObj.get_authordetails);
router.post('/deleteauthor',auth,customerObj.deleteauthor);

// Tag Api
router.post('/addtag',auth,customerObj.add_tag);
router.post('/viewtag',customerObj.view_tag);
router.post('/taglisting',customerObj.get_tagblog);
router.post('/deletetag',auth,customerObj.deletetag);

// Comment Api
router.post('/addcomment',auth,customerObj.add_comment);
router.post('/viewcomment',auth,customerObj.view_comment);
router.post('/getblogcomment',auth,customerObj.getblogcomment);
router.post('/deletecomment',auth,customerObj.deletecomment);

// Admin Side Api 
router.post('/getblogWithId',auth,customerObj.getblogWithId);
router.post('/bloglisting',auth,customerObj.blog_listing);
router.post('/editblogdata',auth,customerObj.editblogdata);

router.post('/getTagWithId',auth,customerObj.getTagWithId);
router.post('/editTagdata',auth,customerObj.editTagdata);

router.post('/getAuthorWithId',auth,customerObj.getAuthorWithId);
router.post('/editAuthordata',auth,customerObj.editAuthordata);

// Admin Side Tag Api

router.post('/adminsidetags',auth,customerObj.adminsidetags);

// Invite Api
router.post('/addinvite',customerObj.add_invite);
router.post('/viewinvite',customerObj.view_invites);
router.post('/getinviteId',customerObj.get_invite);
router.post('/deleteinvite',auth,customerObj.deleteinvite);
router.post('/editinvite',auth,customerObj.editInvitesdata);
// Admin Side Invite Api

router.post('/adminsideinvites',auth,customerObj.adminsideinvite);
router.post('/downloadinvites',customerObj.downloadinvites);

module.exports = router; 