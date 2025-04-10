const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const channelsController = require('../controllers/channelsController')

// Получение моих верефицированных каналов
router.get('/', channelsController.verifiedChannels)

module.exports = router
