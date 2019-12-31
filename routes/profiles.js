const router = require("express").Router();
const controllers = require("../controllers/profiles");

const check_auth = require("../middleware/checkAuth");
const isAdmin = require("../middleware/isAdmin");

router.get("/:profile_id",controllers.get_profile_by_id);
router.get("/",check_auth ,controllers.get_profile);
router.patch("/",check_auth, controllers.update_profile);
router.delete("/",check_auth, controllers.delete_profile);

module.exports = router;