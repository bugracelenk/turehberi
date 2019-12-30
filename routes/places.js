const router = require("express").Router();
const controllers = require("../controllers/places");

const check_auth = require("../middleware/checkAuth");
const isAdmin = require("../middleware/isAdmin");

router.get("/:place_id",controllers.get_place_by_id);
router.get("/",controllers.get_places);
router.post("/create-place", check_auth ,controllers.create_place);
router.patch("/:place_id",check_auth, isAdmin, controllers.update_place);
router.delete("/:patch_id",check_auth, isAdmin, controllers.delete_place);

module.exports = router;