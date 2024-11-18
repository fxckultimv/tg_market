require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./config/logging');
const express = require('express');
const cors = require('cors');
const path = require('path');

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const balanceRoutes = require('./routes/balance');
const productRoutes = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const formatsRouter = require('./routes/formats');
const productStatsRouter = require('./routes/productStats');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const historyRouter = require('./routes/history');
const checkAdminRouter = require('./routes/checkAdmin');
const adminStatsRouter = require('./routes/adminStats');
const ChannelsRouter = require('./routes/channels');
const buyRouter = require('./routes/buy');

const app = express();

// коннект к монгодб
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('MongoDB connection error:', err));

// мидлвари
app.use(cors());
app.use(express.json());

// статика
app.use(express.static(path.join(__dirname, '../Bot/static')));

// роуты
app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/balance', authMiddleware, balanceRoutes);
app.use('/categories', authMiddleware, categoriesRouter);
app.use('/formats', authMiddleware, formatsRouter);
app.use('/products', authMiddleware, productRoutes);
app.use('/product_stats', authMiddleware, productStatsRouter);
app.use('/cart', authMiddleware, cartRouter);
app.use('/orders', authMiddleware, ordersRouter);
app.use('/history', authMiddleware, historyRouter);
app.use('/check_admin', authMiddleware, checkAdminRouter);
app.use('/admin_stats', authMiddleware, adminStatsRouter);
app.use('/channels', authMiddleware, ChannelsRouter);
app.use('/buy', authMiddleware, buyRouter);

// обработка ошибок в мидлварях
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    // раскоментить чтобы запустить шедулю
    // startScheduler();
});

module.exports = app;
