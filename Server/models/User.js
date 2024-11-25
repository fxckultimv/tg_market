const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        telegramId: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            sparse: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User
