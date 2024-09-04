const db = require('../db')

class buyController {
    async buy(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { order_id } = req.body
        try {
            // Обновление статуса заказа на "completed"
            const result = await db.query(
                `UPDATE orders SET status = 'completed' WHERE order_id = $1 AND user_id = $2`,
                [order_id, user_id]
            )

            // Проверяем, были ли обновлены строки
            if (result.rowCount > 0) {
                // Если обновление успешно, отправляем GET-запрос на локальный сервер

                try {
                    // Выполнение запроса к базе данных
                    const buy_info = await db.query(
                        `SELECT p.user_id, oi.post_time, vc.channel_name, vc.channel_url, oi.order_id, oi.message_id
                        FROM orderitems AS oi
                        JOIN products p ON oi.product_id = p.product_id 
                        JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                        WHERE oi.order_id = $1`,
                        [order_id]
                    )

                    // Проверка на наличие данных
                    if (buy_info.rows.length === 0) {
                        throw new Error(
                            'No data found for the provided order_id'
                        )
                    }

                    // Формирование списка post_time и получение остальных данных из первой строки
                    const post_time_list = buy_info.rows.map(
                        (row) => row.post_time
                    )
                    const first_row = buy_info.rows[0]

                    const requestBody = {
                        user_id: first_row.user_id,
                        order_id: first_row.order_id,
                        message_id: first_row.message_id,
                        post_time: post_time_list, // массив всех значений post_time
                        channel_name: first_row.channel_name,
                        channel_url: first_row.channel_url,
                    }

                    // Отправка данных на внешний сервер
                    const response = await fetch('http://localhost:5001/buy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    })

                    if (!response.ok) {
                        throw new Error(
                            `Error from POST request: ${response.statusText}`
                        )
                    }

                    // Получение ответа от внешнего сервера
                    const data = await response.json()

                    // Ответ на клиентский запрос
                    res.status(200).json({
                        message:
                            'Order status updated successfully and POST request sent successfully',
                        externalServerData: data, // Данные с локального сервера
                    })
                } catch (error) {
                    console.error(
                        'Error sending POST request to local server:',
                        error
                    )
                    res.status(500).json({
                        message:
                            'Order status updated but failed to send POST request',
                        error: error.message,
                    })
                }
            } else {
                res.status(404).json({
                    message: 'Order not found or unauthorized',
                })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new buyController()
