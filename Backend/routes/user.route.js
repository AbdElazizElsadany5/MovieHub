const express = require('express');
const cors = require('cors');
const router = express.Router();
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/restrictTo');
const { updateprofile, changepassword, deleteprofile, updateimage, getAllUsers, getUserById, deleteUserByAdmin, updateUserStatus } = require("../controllers/user.controller");

router.use(cors());

router.route("/updateprofile").patch(auth, updateprofile).put(auth, updateprofile).post(auth, updateprofile);
router.route("/changepassword").patch(auth, changepassword).put(auth, changepassword).post(auth, changepassword);
router.route("/deleteprofile").delete(auth, deleteprofile);
router.route("/updateimage").patch(auth, updateimage).put(auth, updateimage).post(auth, updateimage);
router.route("/getAllUsers").get(auth, authAdmin("admin"), getAllUsers);
router.route("/getUserById/:id").get(auth, authAdmin("admin"), getUserById);
router.route("/deleteUserByAdmin/:id").delete(auth, authAdmin("admin"), deleteUserByAdmin);
router.route("/updateUserStatus/:id").patch(auth, authAdmin("admin"), updateUserStatus);

module.exports = router;
