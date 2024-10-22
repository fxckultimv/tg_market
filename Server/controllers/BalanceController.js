const express = require('express');
const router = express.Router();
const UserBalance = require('../models/UserBalance');
const TelegramUser = require('../models/TelegramUser');
const axios = require('axios');

class BalanceController {
  async getBalance(req, res) {
    const telegramUserId = req.telegramUser.id;
    const userBalance = await UserBalance.findOne({ userId: telegramUserId });
    if (!userBalance) {
      userBalance = new UserBalance({ userId: telegramUserId });
      await userBalance.save();
    }
    res.json({ balance: userBalance.balance });
  }

  async replenishBalance(req, res) {
    const telegramUserId = req.telegramUser.id;
    const amount = req.body.amount;
    const paymentId = await createPayment(amount);
    res.redirect(`https://www.t-kassa.ru/pay/${paymentId}`);
  }
}

async function createPayment(amount) {
  const url = 'https://www.t-kassa.ru/api/createPayment';
  const data = {
    amount,
    currency: 'RUB',
    description: 'Balance replenishment',
  };

  const response = await axios.post(url, data);
  const paymentId = response.data.paymentId;

  return paymentId;
}

module.exports = new BalanceController();
