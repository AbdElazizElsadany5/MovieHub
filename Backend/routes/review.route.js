const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { addReview, removeReview, getReviews } = require("../controllers/Reviews.controller");
router.route("/").post(auth, addReview);
router.route("/:movieId").get(getReviews);
router.route("/:id").delete(auth, removeReview);
module.exports = router;