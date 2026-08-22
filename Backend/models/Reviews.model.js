const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "movie",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);
const Review = mongoose.model("review", ReviewSchema);
module.exports = Review;