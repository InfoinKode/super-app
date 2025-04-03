const express = require("express");
const router = express.Router();
const v1 = require("./v1");
const oauth = require("./oauth");
const auth = require("./authRoutes");

router.get("/", (req, res, next) => {
  if (req.session.loggedIn) {
    res.send(
      `<h1>Welcome ${req.session.user.name}, you are logged in!</h1><a href="/logout">Logout</a>`
    );
  } else {
    res.send('<h1>Welcome to the Home Page!</h1><a href="/login">Login</a>');
  }
});

router.use("/api", v1);
router.use("/oauth", oauth);
router.use("", auth);

module.exports = router;
