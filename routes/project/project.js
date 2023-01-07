const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const customerObj = require("../../controllers/project/project");

router.post("/projectadd", auth, customerObj.project_add);
router.post("/projectgetall", auth, customerObj.project_view);
router.post("/projectgetlist", customerObj.project_list);
router.post("/projectdelete", customerObj.project_delete);
router.post("/projectbyid", customerObj.project_by_id);
router.post("/projectedit", customerObj.project_edit);

router.post("/allprojects", customerObj.all_projects);

router.post("/listprojects", customerObj.projects_list);
module.exports = router;
