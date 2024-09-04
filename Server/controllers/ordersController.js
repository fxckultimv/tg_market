const db = require('../db')

class ordersController {
    async orders(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                `SELECT * FROM orders WHERE user_id = $1`,
                [user_id]
            )
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async orderStatus(req, res) {
        const { id } = req.params

        // Проверка корректности order_id
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid order ID' })
        }

        try {
            const result = await db.query(
                `SELECT status FROM orders WHERE order_id = $1`,
                [id]
            )

            // Если заказ не найден
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Order not found' })
            }

            res.status(200).json(result.rows[0])
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async buyItem(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { cart_item_id } = req.body // Ожидается массив идентификаторов элементов корзины

        try {
            await db.query('BEGIN')

            // Получение элементов корзины
            const cartItemsResult = await db.query(
                `SELECT ci.product_id, ci.quantity, ci.post_time, p.price
            FROM cartitems ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_item_id = ANY($1) AND ci.cart_id = (SELECT cart_id FROM cart WHERE user_id = $2)`,
                [cart_item_id, user_id]
            )

            const cartItems = cartItemsResult.rows
            if (cartItems.length === 0) {
                await db.query('ROLLBACK')
                return res.status(400).json({ error: 'No items in cart' })
            }

            // Вычисление общей суммы заказа
            const total_price = cartItems.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            )

            // Создание нового заказа
            const orderResult = await db.query(
                `INSERT INTO orders (user_id, total_price, status)
            VALUES ($1, $2, 'pending')
            RETURNING order_id`,
                [user_id, total_price]
            )

            const order_id = orderResult.rows[0].order_id

            // Добавление элементов заказа
            for (const item of cartItems) {
                await db.query(
                    `INSERT INTO orderitems (order_id, product_id, quantity, price, post_time)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [
                        order_id,
                        item.product_id,
                        item.quantity,
                        item.price,
                        item.post_time,
                    ]
                )
            }

            // Очистка элементов из корзины
            await db.query(
                `DELETE FROM cartitems WHERE cart_item_id = ANY($1)`,
                [cart_item_id]
            )

            // Выполнение внешнего запроса после успешного создания заказа
            try {
                // Выполнение запроса к базе данных для получения данных по заказу
                const order_info = await db.query(
                    `SELECT p.user_id
                FROM Products p
                JOIN OrderItems oi ON oi.product_id = p.product_id
                JOIN Orders o ON o.order_id = oi.order_id
                WHERE o.order_id = $1`,
                    [order_id]
                )

                // Проверка на наличие данных
                if (order_info.rows.length === 0) {
                    throw new Error('No data found for the provided order_id')
                }

                // Получение первой строки из результата запроса
                const seller_info = order_info.rows[0]

                // Логирование данных перед отправкой запроса
                // console.log('User ID:', seller_info.user_id)
                // console.log('Order ID:', order_id)
                console.log(parseInt(order_id))

                // console.log('Target User ID:', seller_info.user_id) // Возможно здесь ошибка

                // Отправка данных на внешний сервер
                const response = await fetch('http://localhost:5001/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user_id,
                        order_id: parseInt(order_id),
                        target_user_id: seller_info.user_id, // Убедитесь, что это правильное значение
                    }),
                })

                // console.log(response)

                if (!response.ok) {
                    throw new Error(
                        `Error from POST request: ${response.statusText}`
                    )
                }

                // Получение ответа от внешнего сервера
                const data = await response.json()

                await db.query('COMMIT')
                // Ответ на клиентский запрос
                res.status(200).json({
                    message:
                        'Order completed successfully and POST request sent successfully',
                    externalServerData: data, // Данные с локального сервера
                })
            } catch (error) {
                await db.query('ROLLBACK')
                console.error(
                    'Error sending POST request to local server:',
                    error
                )
                res.status(500).json({
                    message: 'Order created but failed to send POST request',
                    error: error.message,
                })
            }
        } catch (err) {
            await db.query('ROLLBACK')
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async buyAllItems(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            await db.query('BEGIN')

            // Получение элементов корзины
            const cartItemsResult = await db.query(
                `SELECT ci.product_id, ci.quantity, p.price
                FROM cartItems ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.cart_id = (SELECT cart_id FROM Cart WHERE user_id = $1)`,
                [user_id]
            )

            const cartItems = cartItemsResult.rows
            console.log(cartItems)
            if (cartItems.length === 0) {
                await db.query('ROLLBACK')
                return res.status(400).json({ error: 'No items in cart' })
            }

            // Вычисление общей суммы заказа
            const total_price = cartItems.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            )

            console.log(total_price)

            // Создание нового заказа
            const orderResult = await db.query(
                `INSERT INTO orders (user_id, total_price, status)
                VALUES ($1, $2, 'pending')
                RETURNING order_id`,
                [user_id, total_price]
            )

            const order_id = orderResult.rows[0].order_id

            console.log(order_id)

            // Добавление элементов заказа
            for (const item of cartItems) {
                await db.query(
                    `INSERT INTO orderitems (order_id, product_id, quantity, price)
                    VALUES ($1, $2, $3, $4)`,
                    [order_id, item.product_id, item.quantity, item.price]
                )
            }

            // Обновление статуса заказа
            await db.query(
                `UPDATE orders
                SET status = 'completed'
                WHERE order_id = $1`,
                [order_id]
            )

            // // Очистка корзины
            // await db.query(
            //     `DELETE FROM cartitems
            //     WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`,
            //     [user_id]
            // )

            await db.query('COMMIT')
            res.status(200).json({ message: 'Order completed successfully' })
        } catch (err) {
            await db.query('ROLLBACK')
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new ordersController()
