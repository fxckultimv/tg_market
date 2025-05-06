require('dotenv').config()
const mongoose = require('mongoose')
// тут для себя отпишу что нахуй нет пока логирования
const logger = require('./config/logging')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const { startScheduler } = require('./scheduler')

const authMiddleware = require('./middleware/authMiddleware')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const balanceRoutes = require('./routes/balance')
const productRoutes = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const formatsRouter = require('./routes/formats')
const productStatsRouter = require('./routes/productStats')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const historyRouter = require('./routes/history')
const checkAdminRouter = require('./routes/checkAdmin')
const adminStatsRouter = require('./routes/adminStats')
const ChannelsRouter = require('./routes/channels')
const buyRouter = require('./routes/buy')
const referralRouter = require('./routes/referral')
const promoRouter = require('./routes/promo')
const jwtAuth = require('./middleware/jwtAuth')

const app = express()

// коннект к монгодб
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('MongoDB connection error:', err))

// мидлвари
app.use(
    cors({
        origin: 'https://tma.internal',
        credentials: true, // разрешаем пересылать куки
    })
)
app.use(cookieParser())
app.use(express.json())

// статика
app.use(express.static(path.join(__dirname, '../Bot/static')))

// роуты
app.use('/auth', authRoutes)
app.use('/users', jwtAuth, userRoutes)
app.use('/balance', jwtAuth, balanceRoutes)
app.use('/categories', jwtAuth, categoriesRouter)
app.use('/formats', jwtAuth, formatsRouter)
app.use('/products', jwtAuth, productRoutes)
app.use('/product_stats', jwtAuth, productStatsRouter)
app.use('/cart', jwtAuth, cartRouter)
app.use('/orders', jwtAuth, ordersRouter)
app.use('/history', jwtAuth, historyRouter)
app.use('/check_admin', jwtAuth, checkAdminRouter)
app.use('/admin_stats', jwtAuth, adminStatsRouter)
app.use('/channels', jwtAuth, ChannelsRouter)
app.use('/buy', jwtAuth, buyRouter)
app.use('/referral', jwtAuth, referralRouter)
app.use('/promo', jwtAuth, promoRouter)

// обработка ошибок в мидлварях
app.use((err, req, res, next) => {
    logger.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
    // раскоментить чтобы запустить шедулю
    startScheduler()
})

module.exports = app
