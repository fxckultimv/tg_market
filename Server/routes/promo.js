const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const promoController = require('../controllers/promoController')
const jwtAuth = require('../middleware/jwtAuth')

router.get('/', promoController.myLastPromo)

//Активация промокода
router.post('/activate', promoController.activate)

module.exports = router
