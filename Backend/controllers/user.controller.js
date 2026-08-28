const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

exports.updateprofile = catchAsync(async (req, res, next) => {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id || req.user.id,
        { name, email },
        {
            new: true,
            returnDocument: "after",
            runValidators: false
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
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    const newPassword = req.body.newPassword || req.body.password;
    if (!newPassword) {
        return next(new AppError(400, "Please provide a new password"));
    }
    const saltRounds = Number(process.env.SALT_ROUND) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(
        req.user._id || req.user.id,
        { password: hashedPassword, confirmPassword: hashedPassword },
        { runValidators: false, new: true }
    );

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully"
    });
});

exports.deleteprofile = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id || req.user.id);
    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }
    res.status(200).json({
        success: true,
        message: "Profile Deleted Successfully"
    });
});

exports.updateimage = catchAsync(async (req, res, next) => {
    const imageUrl = req.file ? req.file.filename : (req.body ? req.body.image : null);
    if (!imageUrl) {
        return next(new AppError(400, "Please Upload An Image or provide Image URL"));
    }
    const user = await User.findByIdAndUpdate(
        req.user._id || req.user.id,
        { image: imageUrl },
        {
            new: true,
            returnDocument: "after",
            runValidators: false
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
    const currentAdminId = req.user?._id ? req.user._id.toString() : (req.user?.id ? req.user.id.toString() : "");
    if (currentAdminId && currentAdminId === req.params.id.toString()) {
        return next(new AppError(400, "You cannot delete your own admin account!"));
    }
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
            returnDocument: "after",
            runValidators: false
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
