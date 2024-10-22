// routes/index.js
const express = require('express');
const router = express.Router();
const balanceRouter = require('./balance');

router.use('/balance', balanceRouter);

module.exports = router;
