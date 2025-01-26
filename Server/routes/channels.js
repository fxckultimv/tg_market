const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const channelsController = require('../controllers/channelsController')

router.use(authMiddleware)

// Получение моих верефицированных каналов
router.get('/', channelsController.verifiedChannels)

module.exports = router
