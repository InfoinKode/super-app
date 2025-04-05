const express = require("express");
const router = express.Router();
const oauthController = require("../../controllers/oauthController");

router.get("/authorize", oauthController.authorize);
router.post("/token", oauthController.token);
router.post("/revoke", oauthController.revokeToken);

module.exports = router;