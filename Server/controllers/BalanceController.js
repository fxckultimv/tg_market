// Server/controllers/BalanceController.js
const express = require('express');
const router = express.Router();
const UserBalance = require('../models/UserBalance');
const TelegramUser = require('../models/TelegramUser');

router.get('/balance', async (req, res) => {
  const telegramUserId = req.telegramUser.id;
  const userBalance = await UserBalance.findOne({ userId: telegramUserId });
  if (!userBalance) {
    userBalance = new UserBalance({ userId: telegramUserId });
    await userBalance.save();
  }
  res.json({ balance: userBalance.balance });
});

router.post('/balance/replenish', async (req, res) => {
  const telegramUserId = req.telegramUser.id;
  const amount = req.body.amount;
  const paymentId = await createPayment(amount);
  res.redirect(`https://www.t-kassa.ru/pay/${paymentId}`);
});

async function createPayment(amount) {
  const tKassaApi = require('t-kassa-api');
  const payment = await tKassaApi.createPayment({
    amount,
    currency: 'RUB',
    description: 'Balance replenishment',
  });
  return payment.id;
}

module.exports = router;
