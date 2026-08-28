const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  me,
  googleCallback
} = require("../controllers/auth.controller");

const auth = require("../middlewares/auth");
const googleClient = require("../config/google");

// Normal Auth
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me);

// Google Login
router.get("/google", (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile"
    ],
    include_granted_scopes: true
  });

  res.redirect(url);
});

// Google Callback
router.get("/google/callback", googleCallback);

module.exports = router;