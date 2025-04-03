const express = require('express');
const router = express.Router();
const user = require('./user');
const oauth = require('./oauth');

router.use('', user);
router.use('/oauth', oauth);

module.exports = router;
