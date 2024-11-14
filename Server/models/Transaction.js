const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['topup', 'purchase', 'withdrawal'],
        required: true
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    fee: { 
        type: Number, 
        required: true,
        min: 0
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionHash: {
        type: String,
        sparse: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, { 
    timestamps: true 
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
