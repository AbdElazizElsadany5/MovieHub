const catchAsync = require("../utils/catchAsync");
const Favorite = require("../models/favorite.model");
const AppError = require("../utils/AppError");
exports.addFavorite = catchAsync(async (req, res, next) => {
    const { movie } = req.body;
    const favorite = await Favorite.create({ user: req.user.id, movie });
    res.status(200).json({
        success: true,
        data: favorite
    });
})
exports.removeFavorite = catchAsync(async (req, res, next) => {
    const { movie } = req.body;
    const favorite = await Favorite.findOneAndDelete({ user: req.user.id, movie });
    if (!favorite) {
        return next(new AppError(404, "Favorite Not Found"));
    }
    res.status(200).json({
        success: true,
        data: favorite
    });
})
exports.getFavorites = catchAsync(async (req, res, next) => {
    const favorites = await Favorite.find({ user: req.user.id });
    res.status(200).json({
        success: true,
        data: favorites
    });
})
    