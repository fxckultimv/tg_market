const express = require('express');
const router = express.Router();
const UserBalance = require('../models/UserBalance');
const TelegramUser = require('../models/TelegramUser');
const axios = require('axios');
const logger = require('../logger');

class BalanceController {
  async getBalance(req, res) {
    try {
      const telegramUserId = req.telegramUser.id;
      const userBalance = await UserBalance.findOne({ userId: telegramUserId });
      if (!userBalance) {
        userBalance = new UserBalance({ userId: telegramUserId });
        await userBalance.save();
      }
      logger.info(`User balance retrieved for user ${telegramUserId}`);
      res.json({ balance: userBalance.balance });
    } catch (error) {
      logger.error(`Error retrieving user balance: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async replenishBalance(req, res) {
    try {
      const telegramUserId = req.telegramUser.id;
      const amount = req.body.amount;
      const paymentId = await createPayment(amount);
      logger.info(`Payment created for user ${telegramUserId} with payment ID ${paymentId}`);
      res.redirect(`https://www.t-kassa.ru/pay/${paymentId}`);
    } catch (error) {
      logger.error(`Error creating payment: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async handlePaymentNotification(req, res) {
    try {
      const notification = req.body;
      const url = 'https://www.t-kassa.ru/api/verifyPayment';
      const data = notification;

      const response = await axios.post(url, data);
      const paymentStatus = response.data.status;

      if (paymentStatus === 'paid') {
        const userBalance = await UserBalance.findOne({ userId: notification.userId });
        userBalance.balance += notification.amount;
        await userBalance.save();
        logger.info(`Payment processed for user ${notification.userId} with amount ${notification.amount}`);
      }

      res.json({ success: true });
    } catch (error) {
      logger.error(`Error processing payment notification: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

async function createPayment(amount) {
  try {
    const url = 'https://www.t-kassa.ru/api/createPayment';
    const data = {
      amount,
      currency: 'RUB',
      description: 'Balance replenishment',
    };

    const response = await axios.post(url, data);
    const paymentId = response.data.paymentId;

    return paymentId;
  } catch (error) {
    logger.error(`Error creating payment: ${error.message}`);
    throw error;
  }
}

module.exports = new BalanceController();

