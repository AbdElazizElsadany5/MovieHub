const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/user.model");

const auth = async (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            return next(new AppError(401, "Please login first"));
        }
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findOne({
            isDeleted: { $ne: true },
            _id: decode.id
        }).select("-password -confirmPassword");
        if (!user) {
            return next(new AppError(401, "User not found"));
        }
        req.user = user;

        next();
    } catch (error) {
        return next(new AppError(401, "Invalid or expired token"));
    }
};
module.exports = auth;