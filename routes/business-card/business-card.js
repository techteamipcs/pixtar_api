const express = require('express');
const multer  = require('multer');
const router  = express.Router();
upload        = multer({ dest: '../views' });

const auth    = require("../../middleware/auth");
const customerObj = require('../../controllers/business-card/businesscard-controller');

// Businesscard Api
router.post('/addbusinesscard',auth,customerObj.add_businesscard);
router.post('/editBusinesscarddata',auth,customerObj.editBusinesscarddata);
router.post('/getBusinesscardWithId',customerObj.getBusinesscardWithId);
router.post('/allbusinesscard',customerObj.all_businesscard);
router.post('/viewbusinesscard',customerObj.view_businesscard);
router.post('/deleteBusinesscard',auth,customerObj.deleteBusinesscard);
router.post('/generatevcf',auth,customerObj.generateVCF);

module.exports = router;