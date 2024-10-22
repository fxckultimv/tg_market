const logger = require('../config/logging');

class BalanceController {
  async getBalance(req, res) {
    try {
      const telegramUserId = req.telegramUser.id;
      const userBalance = await UserBalance.findOne({ userId: telegramUserId });
      if (!userBalance) {
        userBalance = new UserBalance({ userId: telegramUserId, currency: 'RUB' });
        await userBalance.save();
      }
      logger.info(`User balance retrieved for user ${telegramUserId}`);
      res.json({ balance: userBalance.balance, currency: userBalance.currency });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async replenishBalance(req, res) {
    try {
      const telegramUserId = req.telegramUser.id;
      const amount = req.body.amount;
      const userBalance = await UserBalance.findOne({ userId: telegramUserId });
      userBalance.balance += amount;
      await userBalance.save();
      logger.info(`Balance replenished for user ${telegramUserId}`);
      res.json({ balance: userBalance.balance, currency: userBalance.currency });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async handlePaymentNotification(req, res) {
    try {
      const notification = req.body;
      const userBalance = await UserBalance.findOne({ userId: notification.userId });
      userBalance.balance += notification.amount;
      await userBalance.save();
      logger.info(`Payment processed for user ${notification.userId}`);
      res.json({ balance: userBalance.balance, currency: userBalance.currency });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  handleError(res, error) {
    logger.error(`Error processing payment: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = BalanceController;
