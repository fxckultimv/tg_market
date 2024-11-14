require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./config/logging');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const balanceRoutes = require('./routes/balance');
const productRoutes = require('./routes/product');
const express = require('express')
const cors = require('cors')
const app = express()
const initAuth = require('./routes/auth')
const categoriesRouter = require('./routes/categories')
const formatsRouter = require('./routes/formats')
const productsRouter = require('./routes/products')
const productStatsRouter = require('./routes/productStats')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const historyRouter = require('./routes/history')
const checkAdminRouter = require('./routes/checkAdmin')
const adminStatsRouter = require('./routes/adminStats')
const ChannelsRouter = require('./routes/channels')
const buyRouter = require('./routes/buy')
const userRouter = require('./routes/user')
const balanceRouter = require('./routes/balance')
<<<<<<< HEAD
const paymentRouter = require('./routes/payment')
const { default: mongoose } = require('mongoose')
// const startScheduler = require('./scheduler/complited')

mongoose.connect('mongodb://localhost:27017/TeleAd', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors())
=======
const path = require('path')
// const startScheduler = require('./scheduler/complited')

// подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('MongoDB connection error:', err));
>>>>>>> b8553b8c25a1e89f3c93e6b103a549e27820ff2d

// мидлвари
app.use(cors())
app.use(express.json())

// обработка файлов из Bot/static
app.use(express.static(path.join(__dirname, '../Bot/static')))

// роуты
app.use('/api/auth', initAuth)
app.use('/categories', categoriesRouter)
app.use('/formats', formatsRouter)
app.use('/products', productsRouter)
app.use('/product_stats', productStatsRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)
app.use('/history', historyRouter)
app.use('/check_admin', checkAdminRouter)
app.use('/admin_stats', adminStatsRouter)
app.use('/channels', ChannelsRouter)
app.use('/buy', buyRouter)
<<<<<<< HEAD
app.use('/user', userRouter)
app.use('/balance', balanceRouter)
app.use('/payments', paymentRouter)
=======
app.use('/api/users', userRouter)
app.use('/api/balance', balanceRoutes)


>>>>>>> b8553b8c25a1e89f3c93e6b103a549e27820ff2d

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    // startScheduler()
})

module.exports = app
