const express = require("express");
const router = express.Router();
const oauthController = require("../../controllers/oauthController");

// Endpoint untuk mendapatkan authorization code
router.get("/authorize", oauthController.authorize);

// Endpoint untuk mendapatkan token
router.post("/token", oauthController.token);

// Endpoint untuk revoke token
router.post("/revoke", oauthController.revokeToken);

module.exports = router;