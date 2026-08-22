const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
exports.updateprofile = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -confirmPassword");
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
exports.changepassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    const matchpassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!matchpassword) {
        return next(new AppError(400, "Password Not Match"));
    }
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password Changed Successfully"
    });
});
exports.deleteprofile = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        message: "Profile Deleted Successfully"
    });
});
exports.updateimage = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError(400, "Please Upload An Image"));
    }
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { image: req.file.filename },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -confirmPassword");
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()
        .select("name email role isActive image");

    res.status(200).json({
        success: true,
        results: users.length,
        data: users
    });
});
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    .select("name email role isActive image");
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});
exports.deleteUserByAdmin = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});
exports.updateUserStatus = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: req.body.isActive },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -confirmPassword");
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        data: user
    });
});
