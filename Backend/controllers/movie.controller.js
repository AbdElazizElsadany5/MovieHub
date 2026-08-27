const Movie = require("../models/movie.model");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/AppError");

const addMovie = catchAsync(async (req, res, next) => {
    const movie = await Movie.create({
        ...req.body,
        createdBy: req.user._id
    });
    
    res.status(201).json({
        status: "success",
        data: {
            movie
        }
    });
});

const getAllMovies = catchAsync(async (req, res, next) => {
    const totalMovies = await Movie.countDocuments();
    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .search()
        .fields()
        .sort()
        .pagination();

    const movies = await features.query;


    res.status(200).json({
        status: "success",
        totalMovies,
        results: movies.length,
        data: {
            movies
        }
    });
});

const getMovie = catchAsync(async (req, res, next) => {

    const movie = await Movie.findById(req.params.id)
        .populate("createdBy", "name -_id");
 
        if (!movie) {
    return next(new AppError(404, "Movie not found"));
}

    res.status(200).json({
        status: "success",
        data: {
            movie
        }
    });
});

const updateMovie = catchAsync(async (req, res, next) => {
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!movie) {
        return next(new AppError(404, "Movie not found"));
    }

    res.status(200).json({
        status: "success",
        data: {
            movie
        }
    });
});

const deleteMovie = catchAsync(async (req, res, next) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
        return next(new AppError(404, "Movie not found"));
    }

    res.status(204).send();
});

module.exports = {
    addMovie,
    getAllMovies,
    getMovie,
    updateMovie,
    deleteMovie
};
