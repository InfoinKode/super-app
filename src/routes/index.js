const express = require("express");
const router = express.Router();
const v1 = require("./v1");
const oauth = require("./oauth");
const auth = require("./authRoutes");

router.get("/", async (req, res, next) => {
  res.render('index', {user: req.session.user})
});

router.use("/api", v1);
router.use("/oauth", oauth);
router.use("", auth);

module.exports = router;
