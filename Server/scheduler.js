const cron = require('node-cron')
const { clearUnpaidOrders } = require('./services/schedulerService')

const startScheduler = () => {
    // Запуск задачи каждую ночь в 3:00
    cron.schedule('0 3 * * *', async () => {
        console.log('Running scheduled task...')
        await clearUnpaidOrders()
    })

    console.log('Scheduler started.')
}

module.exports = { startScheduler }
