const mongoose = require('mongoose')
const logger = require('./logging')
const mongodb_uri = fs.readFileSync('/run/secrets/mongodb_uri', 'utf8').trim()

const connectDB = async () => {
    try {
        await mongoose.connect(mongodb_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        logger.info('MongoDB connected successfully')
    } catch (error) {
        logger.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

module.exports = connectDB
