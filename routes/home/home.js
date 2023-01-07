const express = require('express');
const multer  = require('multer');
const router  = express.Router();
upload        = multer({ dest: '../views' });

const auth    = require("../../middleware/auth");
const customerObj = require('../../controllers/home/home-controller');

router.post('/download',customerObj.download_file);
router.post('/pixtarxml',customerObj.pixtarxml);

router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/addNewFile',upload.any('file'),customerObj.upload_newfile);

router.post('/addprogram',customerObj.addprogram);
router.post('/viewinfluencer',auth,customerObj.viewinfluencer);
router.post('/deleteprogram',auth,customerObj.deleteprogram);

// All Page Api
router.post('/viewpage',auth,customerObj.view_page);
router.post('/addpagedata',customerObj.addpagedata);
router.post('/getPageWithId',auth,customerObj.getPageWithId);
router.post('/getpagewithName',customerObj.getpagewithName);
router.post('/editPagedata',auth,customerObj.editPagedata);

router.post('/getHomePageWithId',auth,customerObj.getHomePageWithId);
router.post('/editHomePagedata',auth,customerObj.editHomePagedata);
router.post('/addhomepagedata',customerObj.addHomepagedata);
router.post('/viewhomepage',auth,customerObj.view_homepage);
router.post('/gethomepagewithName',customerObj.gethomepagewithName);

// About Content APi
router.post('/addaboutnoticed',auth,customerObj.add_aboutnoticed);
router.post('/getAboutNoticeWithId',auth,customerObj.getAboutNoticeWithId);
router.post('/editAboutNoticedata',auth,customerObj.editAboutNoticedata);
router.post('/getAboutNoticeDetails',customerObj.getAboutNoticeDetails);
router.post('/frountAboutNoticeDetails',customerObj.frountAboutNoticeDetails);
router.post('/deleteNotice',auth,customerObj.deleteNotice);

// Testimonial Api
router.post('/addtestimonial',auth,customerObj.add_testimonial);
router.post('/editTestimonialdata',auth,customerObj.editTestimonialdata);
router.post('/getTestimonialWithId',auth,customerObj.getTestimonialWithId);
router.post('/alltestimonial',customerObj.all_testimonial);
router.post('/viewtestimonial',customerObj.view_testimonial);
router.post('/deleteTestimonial',auth,customerObj.deleteTestimonial);

// Contact Us Api
router.post('/contactadd',customerObj.add_contact);
router.post('/allcontact',auth,customerObj.all_contact);
router.post('/deletecontact',auth,customerObj.deletecontact);
router.post('/dashdetails',auth,customerObj.view_dashboard);

module.exports = router;