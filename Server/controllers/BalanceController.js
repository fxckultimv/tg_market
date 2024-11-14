const logger = require('../config/logging');
const UserBalance = require('../models/UserBalance');
const Transaction = require('../models/Transaction');
const { verifyTonPayment, sendTon } = require('../utils/tonUtils');

const MARKET_FEE_PERCENTAGE = 0.05; // 5% fee
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

            const isValid = await verifyTonPayment(tonAmount, transactionHash);
            if (!isValid) {
                logger.warn(`Invalid TON payment for user ${userId}`);
                return res.status(400).json({ error: 'Invalid TON payment' });
            }

            const userBalance = await UserBalance.findOne({ userId });
            if (!userBalance) {
                return res.status(404).json({ error: 'User balance not found' });
            }

            const success = await userBalance.addBalance(tonAmount);
            if (!success) {
                return res.status(500).json({ error: 'Failed to update balance' });
            }

            const transaction = new Transaction({
                userId,
                type: 'topup',
                amount: tonAmount,
                fee: 0,
                status: 'completed',
                transactionHash
            });
            await transaction.save();

            res.json({
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

            const [buyerBalance, sellerBalance] = await Promise.all([
                UserBalance.findOne({ userId: buyerId }),
                UserBalance.findOne({ userId: sellerId })
            ]);

            if (!buyerBalance || !sellerBalance) {
                return res.status(404).json({ error: 'User balance not found' });
            }

            const fee = amount * MARKET_FEE_PERCENTAGE;
            const totalAmount = amount + fee;

            if (!buyerBalance.hasSufficientBalance(totalAmount)) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            const buyerTransaction = new Transaction({
                userId: buyerId,
                type: 'purchase',
                amount: -totalAmount,
                fee,
                status: 'pending',
                details: { productId, sellerId }
            });

            const sellerTransaction = new Transaction({
                userId: sellerId,
                type: 'purchase',
                amount,
                fee: 0,
                status: 'pending',
                details: { productId, buyerId }
            });

            try {
                const buyerDeducted = await buyerBalance.deductBalance(totalAmount);
                if (!buyerDeducted) {
                    throw new Error('Failed to deduct buyer balance');
                }

                const sellerAdded = await sellerBalance.addBalance(amount);
                if (!sellerAdded) {
                    await buyerBalance.addBalance(totalAmount);
                    throw new Error('Failed to add seller balance');
                }

                const feeSent = await sendTon(MARKET_WALLET_ADDRESS, FEE_WALLET_ADDRESS, fee);
                if (!feeSent) {
                    await buyerBalance.addBalance(totalAmount);
                    await sellerBalance.deductBalance(amount);
                    throw new Error('Failed to send market fee');
                }

                buyerTransaction.status = 'completed';
                sellerTransaction.status = 'completed';
                await Promise.all([buyerTransaction.save(), sellerTransaction.save()]);

                logger.info(`Purchase completed. BuyerId: ${buyerId}, SellerId: ${sellerId}, Amount: ${amount} TON`);
                res.json({ 
                    message: 'Purchase completed successfully',
                    buyerTransaction: buyerTransaction._id,
                    sellerTransaction: sellerTransaction._id
                });
            } catch (error) {
                buyerTransaction.status = 'failed';
                sellerTransaction.status = 'failed';
                await Promise.all([buyerTransaction.save(), sellerTransaction.save()]);
                throw error;
            }
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
                if (!sent) {
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

    async handlePaymentNotification(req, res) {
        // Implement logic to handle payment notifications from external payment systems
        // This could include verifying the payment and updating the user's balance
        res.status(200).send('OK');
    }

    handleError(res, error) {
        logger.error(`Error processing request: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = BalanceController;
