const logger = require('../config/logging');

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
      this.handleError(res, error);
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
      this.handleError(res, error);
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
      this.handleError(res, error);
    }
  }

  handleError(res, error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid request' });
    } else if (error.name === 'MongoError') {
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = BalanceController;
