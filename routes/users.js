const express = require("express");
const router = express.Router();

const user_controllers = require("../controllers/users");

router.post("/login", user_controllers.login);
router.post("/register", user_controllers.register);

module.exports = router;