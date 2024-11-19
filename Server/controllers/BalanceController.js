const logger = require('../config/logging');
const UserBalance = require('../models/UserBalance');
const Transaction = require('../models/Transaction');
const { verifyTonPayment, sendTon, sendFee } = require('../utils/tonUtils');

const MARKET_FEE_PERCENTAGE = 0.05; // 5%
const MARKET_WALLET_ADDRESS = process.env.MARKET_WALLET_ADDRESS;
const FEE_WALLET_ADDRESS = process.env.FEE_WALLET_ADDRESS;

class BalanceController {
    async getBalance(req, res) {
        try {
            const userId = req.user._id;
            let userBalance = await UserBalance.findOne({ userId });
            
            if (!userBalance) {
                userBalance = new UserBalance({ userId });
                await userBalance.save();
                logger.info(`Created new balance for user ${userId}`);
            }

            res.json({
                balance: userBalance.balance,
                currency: userBalance.currency,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async replenishBalance(req, res) {
        try {
            const { amount } = req.body;
            const userId = req.user._id;

            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'Invalid amount' });
            }

            let userBalance = await UserBalance.findOne({ userId });
            if (!userBalance) {
                userBalance = new UserBalance({ userId });
            }

            const success = await userBalance.addBalance(amount);
            if (!success) {
                return res.status(500).json({ error: 'Failed to update balance' });
            }

            const transaction = new Transaction({
                userId,
                type: 'topup',
                amount,
                fee: 0,
                status: 'completed'
            });
            await transaction.save();

            logger.info(`Balance replenished for user ${userId}: +${amount} TON`);
            res.json({
                message: 'Balance replenished successfully',
                balance: userBalance.balance
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async handleTonTopUp(req, res) {
        try {
            const { tonAmount, transactionHash } = req.body;
            const userId = req.user._id;
    
            if (!tonAmount || !transactionHash) {
                return res.status(400).json({ error: 'Missing tonAmount or transactionHash' });
            }
    
            const isValid = await verifyTonPayment(tonAmount, transactionHash);
            if (!isValid) {
                logger.warn(`Invalid TON payment for user ${userId}`);
                return res.status(400).json({ error: 'Invalid TON payment' });
            }
    
            const userBalance = await UserBalance.findOne({ userId });
            if (!userBalance) {
                return res.status(404).json({ error: 'User balance not found' });
            }
    
            const success = await userBalance.addBalance(parseFloat(tonAmount));
            if (!success) {
                return res.status(500).json({ error: 'Failed to update balance' });
            }
    
            const transaction = new Transaction({
                userId,
                type: 'topup',
                amount: parseFloat(tonAmount),
                fee: 0,
                status: 'completed',
                transactionHash
            });
            await transaction.save();
    
            res.json({
                message: 'Balance updated successfully',
                balance: userBalance.balance,
                currency: userBalance.currency,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async handlePurchase(req, res) {
        try {
            const { sellerId, amount, productId } = req.body;
            const buyerId = req.user._id;

            const fee = amount * MARKET_FEE_PERCENTAGE;
            const totalAmount = amount + fee;

            const buyerUpdate = await UserBalance.findOneAndUpdate(
                { userId: buyerId, balance: { $gte: totalAmount } },
                { $inc: { balance: -totalAmount } },
                { new: true, runValidators: true }
            );

            if (!buyerUpdate) {
                return res.status(400).json({ error: 'Insufficient balance or concurrent update detected' });
            }

            const sellerUpdate = await UserBalance.findOneAndUpdate(
                { userId: sellerId },
                { $inc: { balance: amount } },
                { new: true, runValidators: true }
            );

            if (!sellerUpdate) {
                await UserBalance.findOneAndUpdate(
                    { userId: buyerId },
                    { $inc: { balance: totalAmount } }
                );
                return res.status(500).json({ error: 'Failed to update seller balance' });
            }

            const [buyerTransaction, sellerTransaction] = await Promise.all([
                Transaction.create({
                    userId: buyerId,
                    type: 'purchase',
                    amount: -totalAmount,
                    fee,
                    status: 'completed',
                    details: { productId, sellerId }
                }),
                Transaction.create({
                    userId: sellerId,
                    type: 'purchase',
                    amount,
                    fee: 0,
                    status: 'completed',
                    details: { productId, buyerId }
                })
            ]);

            const feeSent = await sendFee(fee);
            if (!feeSent.success) {
                logger.error(`Failed to send market fee: ${feeSent.error}`);
            }

            logger.info(`Purchase completed. BuyerId: ${buyerId}, SellerId: ${sellerId}, Amount: ${amount} TON, Fee: ${fee} TON`);
            res.json({ 
                message: 'Purchase completed successfully',
                buyerTransaction: buyerTransaction._id,
                sellerTransaction: sellerTransaction._id
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async handleWithdrawal(req, res) {
        try {
            const { amount, toAddress } = req.body;
            const userId = req.user._id;

            const userBalance = await UserBalance.findOne({ userId });
            if (!userBalance) {
                return res.status(404).json({ error: 'User balance not found' });
            }

            if (!userBalance.hasSufficientBalance(amount)) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            const transaction = new Transaction({
                userId,
                type: 'withdrawal',
                amount: -amount,
                fee: 0,
                status: 'pending',
                details: { toAddress }
            });

            try {
                const deducted = await userBalance.deductBalance(amount);
                if (!deducted) {
                    throw new Error('Failed to deduct user balance');
                }

                const sent = await sendTon(MARKET_WALLET_ADDRESS, toAddress, amount);
                if (!sent.success) {
                    await userBalance.addBalance(amount);
                    throw new Error('Failed to send TON');
                }

                transaction.status = 'completed';
                await transaction.save();

                logger.info(`Withdrawal completed. UserId: ${userId}, Amount: ${amount} TON`);
                res.json({ 
                    message: 'Withdrawal completed successfully',
                    transaction: transaction._id
                });
            } catch (error) {
                transaction.status = 'failed';
                await transaction.save();
                throw error;
            }
        } catch (error) {
            this.handleError(res, error);
        }
    }

    handleError(res, error) {
        logger.error(`Error processing request: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = BalanceController;
