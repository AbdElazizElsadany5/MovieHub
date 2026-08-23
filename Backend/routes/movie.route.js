const express = require("express");
const movieController = require("../controllers/movie.controller");
const auth = require("../middlewares/auth");
const restrictTo = require("../middlewares/restrictTo");
const router = express.Router();


router.get("/", movieController.getAllMovies);
router.get("/:id", movieController.getMovie);

router.post(
    "/",
    auth,
    restrictTo("admin"),
    movieController.addMovie
);
router.put(
    "/:id",
    auth,
    restrictTo("admin"),
    movieController.updateMovie
);
router.delete(
    "/:id",
    auth,
    restrictTo("admin"),
    movieController.deleteMovie
);
module.exports = router;
