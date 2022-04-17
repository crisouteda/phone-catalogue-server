const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { isLoggedIn } = require("../lib/auth");
const {
  getAll,
  getAllPagination,
  getPhoneById,
  createPhone,
  deletePhoneById,
  updatePhone,
} = require("../controllers/phone");

const router = express.Router();

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", getAll);
router.get("/pagination/:items/:exclusiveStartKey?", getAllPagination);
router.get("/:id", getPhoneById);
router.post("/", isLoggedIn, createPhone);
router.post("/delete", isLoggedIn, deletePhoneById);
router.post("/put", isLoggedIn, updatePhone);

module.exports = router;
