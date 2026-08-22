const catchAsync = require("../utils/catchAsync");
const Review = require("../models/Reviews.model");
const AppError = require("../utils/AppError");
exports.addReview = catchAsync(async (req, res, next) => {

    const { movie, rating, review: reviewText } = req.body;

    const newReview = await Review.create({
        user: req.user.id,
        movie,
        rating,
        review: reviewText
    });

    res.status(201).json({
        success: true,
        data: newReview
    });
});
exports.removeReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError(404, "Review Not Found"));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});
exports.getReviews = catchAsync(async (req, res, next) => {

    const reviews = await Review.find({
        movie: req.params.movieId
    }).populate("user", "name image");

    res.status(200).json({
        success: true,
        results: reviews.length,
        data: reviews
    });
});