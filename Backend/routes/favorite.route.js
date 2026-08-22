const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const {
    addFavorite,
    removeFavorite,
    getFavorites
} = require("../controllers/favorite.controller");

router.route("/")
    .post(auth, addFavorite)
    .get(auth, getFavorites);

router.route("/:movieId")
    .delete(auth, removeFavorite);

module.exports = router;