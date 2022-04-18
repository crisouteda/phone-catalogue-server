const express = require("express");
const bodyParser = require("body-parser");
const { signUp, signIn } = require("../controllers/auth");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/signup", signUp);
router.post("/signin", signIn);

module.exports = router;
