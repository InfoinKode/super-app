const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const { redirectIfLoggedIn, requireLogin } = require("../middlewares/loginMiddleware")

router.get("/login", redirectIfLoggedIn, authController.login);

router.post("/login", authController.handleLogin);
router.get("/verify", redirectIfLoggedIn, authController.verify);
router.post("/verify", authController.verifyOTP);
router.get("/register", redirectIfLoggedIn, authController.register);
router.post("/register", authController.handleRegister);
router.get("/logout", requireLogin, authController.logout);


module.exports = router;
