require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./config/logging');
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

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

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

const connectWithRetry = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => {
        logger.error('MongoDB connection error:', err);
        setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, '../Bot/static')));

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

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: err.errors
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
    
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Process terminated');
        mongoose.connection.close(false, () => {
            process.exit(0);
        });
    });
});

module.exports = app;
