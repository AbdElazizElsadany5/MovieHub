 const AppError = require("../utils/AppError");
const globalError = (err, req, res, next) => {

    console.log(err);
    let error = err;
    
    if (err.name === "CastError") {
        error = new AppError(
            400,
            `Invalid ${err.path}: ${err.value}`
        );
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map(err => err.message)
            .join(", ");

        error = new AppError(400, message);
    }

    if (err.code === 11000) {
        const [key, value] = Object.entries(err.keyValue)[0];

        error = new AppError(
            400,
            `Duplicate key: ${key} with value: ${value}`
        );
    }

    if (err.name === "TokenExpiredError") {
        error = new AppError(
            401,
            "Please login again"
        );
    }

    if (err.name === "JsonWebTokenError") {
        error = new AppError(
            401,
            "Invalid token, please login again"
        );
    }

    res.status(error.statusCode || 500).json({
        status: error.status || "error",
        message: error.message || "Internal server error"
    });
};

module.exports = globalError;
