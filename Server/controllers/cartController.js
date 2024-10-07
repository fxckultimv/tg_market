const db = require('../db')

class CartController {
    async cart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                `SELECT
                ci.cart_item_id,
                ci.product_id,
                ci.quantity,
                p.title,
                p.description,
                p.price,
                ci.post_time,
                v.channel_tg_id,
                u.rating
            FROM
                Cart c
            JOIN
                CartItems ci ON c.cart_id = ci.cart_id
            JOIN
                Products p ON ci.product_id = p.product_id
            JOIN 
                verifiedchannels v ON p.channel_id = v.channel_id
            JOIN 
                users u ON u.user_id = c.user_id
            WHERE
                c.user_id = $1`,
                [user_id]
            )

            let cart = {
                products: {},
            }

            result.rows.forEach((row) => {
                // Добавляем продукт в объект products, если его там еще нет
                if (!cart.products[row.product_id]) {
                    cart.products[row.product_id] = {
                        title: row.title,
                        rating: row.rating,
                        description: row.description,
                        price: row.price,
                        channel_tg_id: row.channel_tg_id,
                        items: [], // Создаем массив для хранения всех элементов корзины для данного продукта
                    }
                }

                // Добавляем элемент корзины в соответствующий продукт
                cart.products[row.product_id].items.push({
                    cart_item_id: row.cart_item_id,
                    product_id: row.product_id,
                    quantity: row.quantity,
                    post_time: row.post_time,
                })
            })

            res.json(cart)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async addToCart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { product_id, quantity, date, post_time, format } = req.body

        if (quantity == null) {
            res.status(400).json({ error: `Quantity = ${quantity}` })
        }

        if (!Array.isArray(date) || date.length === 0) {
            return res.status(400).json({ error: 'Invalid date format' })
        }

        try {
            let date_product = await db.query(
                `SELECT EXISTS (SELECT 1 FROM products WHERE product_id = $1 AND post_time = $2) AS exists;`,
                [product_id, post_time]
            )

            if (!date_product.rows[0].exists) {
                return res
                    .status(404)
                    .json({ error: 'Post_time is not valide' })
            }
            // Ищем корзину пользователя
            let result = await db.query(
                `SELECT cart_id FROM cart WHERE user_id = $1 LIMIT 1`,
                [user_id]
            )

            let user_cart_id

            if (result.rows.length === 0) {
                // Если корзина не найдена, создаем новую
                result = await db.query(
                    `INSERT INTO cart (user_id, created_at) VALUES ($1, NOW()) RETURNING cart_id`,
                    [user_id]
                )
                user_cart_id = result.rows[0].cart_id
            } else {
                // Если корзина найдена, получаем её ID
                user_cart_id = result.rows[0].cart_id
            }

            for (const time of date) {
                // Добавляем товар в корзину для каждого date
                const datePart = new Date(time).toISOString().split('T')[0] // Получаем только дату
                const dateTime = `${datePart}T${post_time}` // Объединяем с временем

                await db.query(
                    `INSERT INTO cartitems (cart_id, product_id, quantity, post_time, format) VALUES ($1, $2, $3, $4, $5)`,
                    [user_cart_id, product_id, quantity, dateTime, format]
                )
            }

            res.status(200).json({
                message: 'Product added to cart successfully',
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deleteItemCart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        const { cart_item_id } = req.body
        try {
            const result = await db.query(
                `DELETE FROM cartitems
            USING cart
            WHERE cartitems.product_id = $2 
            AND cart.user_id = $1; 
            `,
                [user_id, cart_item_id]
            )
            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Successfully deleted' })
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deleteAllItemsCart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        const { product_id } = req.body
        try {
            const result = await db.query(
                'SELECT  remove_product_from_cart($1, $2)',
                [user_id, product_id]
            )
            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Successfully deleted' })
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new CartController()
