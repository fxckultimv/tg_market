const db = require('../db')

class CartController {
    async cart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                `SELECT
                ci.cart_item_id,
                ci.cart_id,
                ci.product_id,
                ci.quantity,
                p.title,
                p.description,
                p.price,
                p.post_time
            FROM
                Cart c
            JOIN
                CartItems ci ON c.cart_id = ci.cart_id
            JOIN
                Products p ON ci.product_id = p.product_id
            WHERE
                c.user_id = $1`,
                [user_id]
            )
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async addToCart(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { product_id, quantity, post_time } = req.body

        if (quantity == null) {
            res.status(400).json({ error: `Quantity = ${quantity}` })
        }

        if (!Array.isArray(post_time) || post_time.length === 0) {
            return res.status(400).json({ error: 'Invalid post_time format' })
        }

        try {
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

            for (const time of post_time) {
                // Добавляем товар в корзину для каждого post_time
                await db.query(
                    `INSERT INTO cartitems (cart_id, product_id, quantity, post_time) VALUES ($1, $2, $3, $4)`,
                    [user_cart_id, product_id, quantity, time]
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
            WHERE cartitems.cart_item_id = $2 
            AND cart.cart_id = cartitems.cart_id
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
