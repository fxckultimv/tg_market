const express = require('express')
const cryptoBotController = require('../controllers/cryptoBotController')
const router = express.Router()

router.post('/:secret', cryptoBotController.cryptoWebhook)

module.exports = router
