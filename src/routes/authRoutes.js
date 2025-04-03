const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

// Endpoint untuk menampilkan halaman login
router.get("/login", authController.login);

// Endpoint untuk menangani proses login
router.post("/login", authController.handleLogin);

router.get("/logout", authController.logout);


module.exports = router;
