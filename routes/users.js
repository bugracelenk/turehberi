const express = require("express");
const router = express.Router();

const user_controllers = require("../controllers/users");
const check_auth = require("../middleware/checkAuth");

router.post("/login", user_controllers.login);
router.post("/register", user_controllers.register);
router.post("/verify/:user_id", user_controllers.user_verify);
router.post("/change-email", check_auth, user_controllers.change_email);
router.post("/change-password", check_auth, user_controllers.change_password);

module.exports = router;