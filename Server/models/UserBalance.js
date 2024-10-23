const mongoose = require('mongoose')
require('dotenv').config()

// Подключение к базе данных MongoDB
const dbURI = process.env.MONGO_DB_URL

mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Подключение к MongoDB установлено'))
    .catch((err) => console.log('Ошибка подключения к MongoDB: ', err))
const userBalanceSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'RUB' },
})

const UserBalance = mongoose.model('UserBalance', userBalanceSchema)

module.exports = UserBalance
