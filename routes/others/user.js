const express = require('express')
const router  = express.Router()

const auth    = require("../../middleware/auth");
const customerObj = require('../../controllers/others/user-controller');

// Register User

router.post('/login', customerObj.login);
router.post('/resetpassword', customerObj.resetpassword);
router.post('/newpassword', customerObj.newpassword);
router.post('/validatetoken', customerObj.validatetoken);
router.post('/sms', customerObj.send_sms);
router.post('/registerUser', customerObj.registerUser);
router.post('/updateprofile',auth,customerObj.updateprofile);
router.post('/adminuserview',auth,customerObj.admin_view_user);
router.post('/getuserwithid',auth,customerObj.get_user_with_id);
router.post('/deleteuser',auth,customerObj.delete_user);
module.exports = router;