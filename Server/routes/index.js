// Server/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const initAuth = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const formatsRouter = require('./routes/formats');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const historyRouter = require('./routes/history');
const checkAdminRouter = require('./routes/checkAdmin');
const adminStatsRouter = require('./routes/adminStats');
const ChannelsRouter = require('./routes/channels');
const buyRouter = require('./routes/buy');
const userRouter = require('./routes/user');
const balanceRouter = require('./routes/index'); // New router for balance endpoints
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Bot/static')));

app.use('/auth', initAuth);
app.use('/categories', categoriesRouter);
app.use('/formats', formatsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/history', historyRouter);
app.use('/check_admin', checkAdminRouter);
app.use('/admin_stats', adminStatsRouter);
app.use('/channels', ChannelsRouter);
app.use('/buy', buyRouter);
app.use('/user', userRouter);
app.use('/balance', balanceRouter); // New endpoint for balance

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
