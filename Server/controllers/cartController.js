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

        try {
            const post_time_json = JSON.stringify(post_time)

            const result = await db.query(
                `SELECT add_to_cart($1, $2, $3, $4)`,
                [user_id, product_id, quantity, post_time_json]
            )
            // console.log(result)

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
