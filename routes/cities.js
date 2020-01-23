const router = require("express").Router();
const controllers = require("../controllers/cities");

const check_auth = require("../middleware/checkAuth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", controllers.get_cities);
router.post("/",check_auth, isAdmin, controllers.add_city);

module.exports = router;
