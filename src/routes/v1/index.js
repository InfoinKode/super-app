const express = require('express');
const router = express.Router();
const user = require('./user');

router.use('/v1', user);

module.exports = router;
