const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const referralController = require('../controllers/referralController')

router.use(authMiddleware)

// router.get('/', buyController.infoForBuy)

// Обработка нажатия на кнопку оплатить
router.get('/', referralController.referral)

module.exports = router
