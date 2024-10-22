const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: 'RUB' },
});

const UserBalance = mongoose.model('UserBalance', userBalanceSchema);

module.exports = UserBalance;
