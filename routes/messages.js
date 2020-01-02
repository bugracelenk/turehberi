const router = require("express").Router();
const controllers = require("../controllers/messages");

const check_auth = require("../middleware/checkAuth");

router.get("/get-chat/:profile_id",check_auth, controllers.get_chat);
router.get("/",check_auth, controllers.get_messages);
router.post("/:profile_id", check_auth ,controllers.send_message);
router.delete("/:profile_id",check_auth, controllers.delete_chat);

module.exports = router;