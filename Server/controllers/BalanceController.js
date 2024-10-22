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
