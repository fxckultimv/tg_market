const mongoose = require('mongoose')
// тут для себя отпишу что нахуй нет пока логирования
const logger = require('../config/logging')

const userBalanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: 'TON',
        },
    },
    {
        timestamps: true,
    }
)

userBalanceSchema.methods.hasSufficientBalance = function (amount) {
    return this.balance >= amount
}

userBalanceSchema.methods.deductBalance = async function (amount) {
    if (!this.hasSufficientBalance(amount)) {
        logger.warn(`Insufficient balance for user ${this.userId}`)
        return false
    }

    this.balance -= amount
    try {
        await this.save()
        logger.info(`Balance deducted for user ${this.userId}: -${amount} TON`)
        return true
    } catch (error) {
        logger.error(
            `Failed to deduct balance for user ${this.userId}: ${error.message}`
        )
        return false
    }
}

userBalanceSchema.methods.addBalance = async function (amount) {
    this.balance += amount
    try {
        await this.save()
        logger.info(`Balance added for user ${this.userId}: +${amount} TON`)
        return true
    } catch (error) {
        logger.error(
            `Failed to add balance for user ${this.userId}: ${error.message}`
        )
        return false
    }
}

const UserBalance = mongoose.model('UserBalance', userBalanceSchema)

module.exports = UserBalance
