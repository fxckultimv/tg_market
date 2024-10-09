const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const userController = require('../controllers/userController')

router.use(authMiddleware)

// Получение продуктов пользователя
router.get('/:uuid', userController.user)

router.get('/reviews/:uuid', userController.userReviews)

module.exports = router