 const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Movie title is required"],
            trim: true,
        },

        overview: {
            type: String,
            required: [true, "Movie overview is required"],
            trim: true,
        },

        poster: {
            type: String,
            required: [true, "Movie poster is required"],
            trim: true,
        },

        backdrop: {
            type: String,
            default: "",
            trim: true,
        },

        trailerUrl: {
            type: String,
            default: "",
            trim: true,
        },

        genres: {
            type: [String],
            required: [true, "Movie genres are required"],
            default: [],
        },

        releaseYear: {
            type: Number,
            required: [true, "Release year is required"],
            min: [1888, "Release year must be 1888 or later"],
        },

        duration: {
            type: Number,
            default: 0,
            min: [0, "Duration cannot be negative"],
        },

        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [10, "Rating cannot be greater than 10"],
        },

        numReviews: {
            type: Number,
            default: 0,
            min: [0, "Number of reviews cannot be negative"],
        },

        cast: {
            type: [String],
            default: [],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Movie = mongoose.model("Movies", movieSchema);

module.exports = Movie;
