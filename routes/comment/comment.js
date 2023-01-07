const express     = require('express')
const router      = express.Router()
const auth        = require("../../middleware/auth");
const customerObj = require('../../controllers/comment/comment-controller');

router.post('/add',customerObj.addComment);
router.post('/viewcomment',customerObj.view_comment);

module.exports    = router; 