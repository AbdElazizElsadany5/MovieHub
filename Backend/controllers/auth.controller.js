const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const User = require("../models/user.model")
const AppError = require("../utils/AppError")
const catchAsync = require("../utils/catchAsync")
const jwtSign = promisify(jwt.sign)
const { google } = require("googleapis");
const googleClient = require("../config/google");

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
        return next(new AppError(400, "Invalid email or password"));
    }
    const matchpassword = await bcrypt.compare(password, finduser.password)
    if (!matchpassword) {
        return next(new AppError(400, "Invalid email or password"));
    }
    const token = await jwtSign({ id: finduser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.status(200).json({
        success: true,
        token,
        data: finduser
    })
}) 
exports.me = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        _id: req.user._id,
        isDeleted: { $ne: true }
    }).select("-password -confirmPassword -isDeleted");

    if (!user) {
        return next(new AppError(404, "User Not Found"));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
exports.googleCallback = catchAsync(async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Google authorization code is missing"
      });
    }

    // Get Google tokens
    const { tokens } = await googleClient.getToken(code);

    googleClient.setCredentials(tokens);

    // Get Google user information
    const oauth2 = google.oauth2({
      auth: googleClient,
      version: "v2"
    });

    const { data } = await oauth2.userinfo.get();

    // Find user in MongoDB
    let user = await User.findOne({
      email: data.email
    });

    // Register automatically if user doesn't exist
    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        googleId: data.id,
        image: data.picture,
        role: "user",
        isActive: true
      });
    }

    // Check account
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Return to Angular
    res.redirect(
      `http://localhost:4200/google-success?token=${token}`
    );

  } catch (error) {
    console.error("Google Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Google authentication failed"
    });
  }
});