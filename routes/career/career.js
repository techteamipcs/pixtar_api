const express     = require('express')
const router      = express.Router()
const auth        = require("../../middleware/auth");
const customerObj = require('../../controllers/career/career-controller');

router.post('/add',auth,customerObj.addCareer);
router.post('/admincareerview',auth,customerObj.admin_view_career);
router.post('/getcareerWithId',auth,customerObj.get_career_with_id);
router.post('/editcareerdata',auth,customerObj.edit_career_data);
router.post('/deletecareer',auth,customerObj.delete_career);

// Fronted 
router.post('/careerview',customerObj.view_career);
router.post('/careerdetail',customerObj.get_career_with_id);

module.exports    = router; 