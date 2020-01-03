const router = require("express").Router();
const controllers = require("../controllers/comments");

const check_auth = require("../middleware/checkAuth");
const isAdmin = require("../middleware/isAdmin");

router.post("/:place_id",controllers.create_comment);
router.get("/:place_id", controllers.get_comments_for_place);
router.delete("/", controllers.delete_comment);
router.get("/unapproveds", controllers.get_unapproved_comments);
router.post("/approve-comment", controllers.approve_comment);

module.exports = router;