const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const User = require("../models/user.model")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const jwtSign = promisify(jwt.sign)

exports.signup = catchAsync(async (req, res, next) => {
    const { email, password, name, image } = req.body
    const finduser = await User.findOne({ email })
    if (finduser) {
        return next(new AppError(400, "User Already Exists"));
    }
    const hashpassword = await bcrypt.hash(password, +process.env.SALT_ROUND)
    const user = await User.create({
        name,
        email,
        password: hashpassword,
        confirmPassword: hashpassword,
        image,
    })
    user.password = undefined
    user.confirmPassword = undefined
    user.role = undefined
    user.isDeleted = undefined
    res.status(200).json({
        success: true,
        data: user
    })
})
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const finduser = await User.findOne({ email })
    if (!finduser) {
        return next(new AppError(400, "User Not Exists"));
    }
    const matchpassword = await bcrypt.compare(password, finduser.password)
    if (!matchpassword) {
        return next(new AppError(400, "Password Not Match"));
    }
    const token = await jwtSign({ id: finduser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.status(200).json({
        success: true,
        token,
        data: finduser
    })
}) 