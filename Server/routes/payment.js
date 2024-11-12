const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const tkassaApiUrl = 'https://api.t-kassa.ru/v1';
const tkassaMerchantId = process.env.TKASSA_MERCHANT_ID;
const tkassaSecretKey = process.env.TKASSA_SECRET_KEY;

router.post('/top-up', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);

    // Оплата
    const paymentResponse = await axios.post(`${tkassaApiUrl}/payments`, {
      merchant_id: tkassaMerchantId,
      order_id: userId,
      amount: amount,
      description: 'Top-up balance',
    }, {
      headers: {
        'Authorization': `Bearer ${tkassaSecretKey}`,
      },
    });

    // Обновление баланса пользователя
    user.balance += amount;
    await user.save();

    res.json({ message: 'Top-up successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/withdraw', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);

    // Вывод
    const withdrawalResponse = await axios.post(`${tkassaApiUrl}/withdrawals`, {
      merchant_id: tkassaMerchantId,
      order_id: userId,
      amount: amount,
      description: 'Withdraw balance',
    }, {
      headers: {
        'Authorization': `Bearer ${tkassaSecretKey}`,
      },
    });

    // Обновление баланса пользователя
    user.balance -= amount;
    await user.save();

    res.json({ message: 'Withdrawal successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;