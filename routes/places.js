const router = require("express").Router();
const controllers = require("../controllers/places");

const check_auth = require("../middleware/checkAuth");
const isAdmin = require("../middleware/isAdmin");

router.get("/:place_id",controllers.get_place_by_id);
router.get("/",controllers.get_places);
router.post("/create-place", check_auth ,controllers.create_place);
router.patch("/fav-place/:place_id", check_auth ,controllers.fav_place);
router.patch("/unfav-place/:place_id", check_auth ,controllers.unfav_place);
router.patch("/like-place/:place_id", check_auth ,controllers.like_place);
router.patch("/dislike-place/:place_id", check_auth ,controllers.dislike_place);
router.patch("/add-wg-list/:place_id",check_auth, controllers.add_wg_list);
router.patch("/add-gone-list/:place_id", check_auth ,controllers.add_gone_list);
router.patch("/:place_id",check_auth, isAdmin, controllers.update_place);
router.delete("/:place_id",check_auth, isAdmin, controllers.delete_place);

module.exports = router;