const mongoose = require('mongoose')
const logger = require('../config/logging')
require('dotenv').config()

// MongoDB connection
const dbURI = process.env.MONGO_DB_URL

mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => console.log('MongoDB connection error: ', err))

const userBalanceSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true,
        ref: 'User'
    },
    balance: { 
        type: Number, 
        required: true, 
        default: 0,
        min: 0 
    },
    currency: { 
        type: String, 
        required: true, 
        default: 'TON' 
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
}, { 
    timestamps: true 
})

userBalanceSchema.methods.hasSufficientBalance = function(amount) {
    return this.balance >= amount
}

userBalanceSchema.methods.deductBalance = async function(amount) {
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
        logger.error(`Failed to deduct balance for user ${this.userId}: ${error.message}`)
        return false
    }
}

userBalanceSchema.methods.addBalance = async function(amount) {
    this.balance += amount
    try {
        await this.save()
        logger.info(`Balance added for user ${this.userId}: +${amount} TON`)
        return true
    } catch (error) {
        logger.error(`Failed to add balance for user ${this.userId}: ${error.message}`)
        return false
    }
}

const UserBalance = mongoose.model('UserBalance', userBalanceSchema)

module.exports = UserBalance
