const db = require('../db')

class AdminController {
    async stats(req, res) {
        try {
            const now = new Date()
            const startOfDay = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            )
            const startOfWeek = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() - now.getDay()
            )
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfYear = new Date(now.getFullYear(), 0, 1)

            // Запросы для пользователей
            const totalUsers = await db.query('SELECT COUNT(*) FROM users')
            // Запросы для продуктов
            const totalProducts = await db.query(
                'SELECT COUNT(*) FROM products'
            )
            // Запросы для заказов
            const totalOrders = await db.query('SELECT COUNT(*) FROM orders')
            // Запрос для общего оборота
            const totalRevenue = await db.query(
                'SELECT SUM(total_price) FROM orders'
            )
            const OrderInTheMounth = await db.query(
                `
                SELECT  o.order_id, o.total_price, o.created_at
                FROM orders AS o
                WHERE EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
                    AND EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND o.status = 'completed'
                ORDER BY o.created_at `,
                []
            )

            res.json({
                totalUsers: totalUsers.rows[0].count,
                totalProducts: totalProducts.rows[0].count,
                totalOrders: totalOrders.rows[0].count,
                totalRevenue: totalRevenue.rows[0].sum || 0,
                OrdersMonth: OrderInTheMounth.rows,
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async users(req, res) {
        try {
            const id = req.query.id ? parseInt(req.query.id) : null
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10

            let baseQuery = 'FROM users WHERE 1=1'
            const params = []

            if (id !== null) {
                baseQuery += ` AND user_id::text LIKE $${params.length + 1}`
                params.push(`%${id}%`)
            }

            const userQuery = `SELECT * ${baseQuery} LIMIT $${
                params.length + 1
            } OFFSET $${params.length + 2}`
            const countQuery = `SELECT COUNT(*) ${baseQuery}`

            params.push(limit)
            params.push(skip)

            const [usersResult, countResult] = await Promise.all([
                db.query(userQuery, params),
                db.query(countQuery, params.slice(0, -2)),
            ])

            const total = parseInt(countResult.rows[0].count, 10)

            if (usersResult.rows.length > 0) {
                res.json({
                    users: usersResult.rows,
                    total,
                })
            } else {
                res.status(204).json({ error: 'Users not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async user(req, res) {
        const { id } = req.params
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE user_id = $1',
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(404).json({ error: 'User not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async userProducts(req, res) {
        const { id } = req.params

        try {
            const result = await db.query(
                'SELECT * FROM products WHERE user_id = $1',
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'User products not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async products(req, res) {
        try {
            const name = req.query.name || null
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10

            let baseQuery =
                'FROM products AS p JOIN verifiedchannels vc ON p.channel_id = vc.channel_id WHERE 1=1'
            const params = []

            if (name !== null) {
                baseQuery += ` AND vc.channel_name::text LIKE $${
                    params.length + 1
                }`
                params.push(`%${name}%`)
            }

            const productsQuery = `SELECT * ${baseQuery} LIMIT $${
                params.length + 1
            } OFFSET $${params.length + 2}`
            const countQuery = `SELECT COUNT(*) ${baseQuery}`

            params.push(limit)
            params.push(skip)

            const [productsResult, countResult] = await Promise.all([
                db.query(productsQuery, params),
                db.query(countQuery, params.slice(0, -2)),
            ])

            const total = parseInt(countResult.rows[0].count, 10)

            if (productsResult.rows.length > 0) {
                res.json({
                    products: productsResult.rows,
                    total,
                })
            } else {
                res.status(204).json({ error: 'Products not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async categories(req, res) {
        try {
            const result = await db.query('SELECT * FROM categories')
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async addCategories(req, res) {
        const { category_name } = req.body
        try {
            const result = await db.query(
                'INSERT INTO categories (category_name) VALUES ($1) RETURNING *',
                [category_name]
            )
            res.status(201).json(result.rows[0])
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deleteCategories(req, res) {
        const { category_id } = req.body

        try {
            const result = await db.query(
                'DELETE FROM categories WHERE category_id=$1',
                [category_id]
            )
            res.status(200).json(result.rows[0])
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async patchCategories(req, res) {
        const { category_id, category_name } = req.body
        try {
            const result = await db.query(
                'UPDATE categories SET category_name = $2 WHERE category_id = $1 RETURNING *',
                [category_id, category_name]
            )
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0])
            } else {
                res.status(404).json({ error: 'Category not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async cartUser(req, res) {
        const { id } = req.params
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
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(204).send()
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async orders(req, res) {
        try {
            const id = req.query.id ? parseInt(req.query.id) : null
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10

            let baseQuery = 'FROM orders AS o WHERE 1=1'
            const params = []

            if (id !== null) {
                baseQuery += ` AND order_id::text LIKE $${params.length + 1}`
                params.push(`%${id}%`)
            }

            const ordersQuery = `SELECT * ${baseQuery} LIMIT $${
                params.length + 1
            } OFFSET $${params.length + 2}`
            const countQuery = `SELECT COUNT(*) ${baseQuery}`

            params.push(limit)
            params.push(skip)

            const [ordersResult, countResult] = await Promise.all([
                db.query(ordersQuery, params),
                db.query(countQuery, params.slice(0, -2)),
            ])

            const total = parseInt(countResult.rows[0].count, 10)

            if (ordersResult.rows.length > 0) {
                res.json({
                    orders: ordersResult.rows,
                    total,
                })
            } else {
                res.status(204).json({ error: 'Products not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    // async order(req, res) {
    //     const { id } = req.params
    //     try {
    //         const result = await db.query(
    //             `SELECT * FROM orders WHERE order_id = $1`,
    //             [id]
    //         )
    //         if (result.rows.length > 0) {
    //             res.json(result.rows[0])
    //         } else {
    //             res.status(204).send() // Возвращаем статус 204, если данных нет
    //         }
    //     } catch (err) {
    //         console.error(err)
    //         res.status(500).json({ error: 'Database error' })
    //     }
    // }

    async orderDetails(req, res) {
        const { id } = req.params
        try {
            const result = await db.query(
                `SELECT * FROM orderitems WHERE order_id = $1`,
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(204).send() // Возвращаем статус 204, если данных нет
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async orderUser(req, res) {
        const { id } = req.params

        try {
            const result = await db.query(
                `SELECT * FROM orders WHERE user_id = $1`,
                [id]
            )
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deleteProduct(req, res) {
        const { product_id } = req.params

        try {
            const result = await db.query(
                'DELETE FROM products WHERE product_id=$1 RETURNING *',
                [product_id]
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

    async promo(req, res) {
        try {
            const result = await db.query('SELECT * FROM promo_codes')

            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async addPromo(req, res) {
        const { code, valid_days, max_activations, percent } = req.body

        if (
            !code ||
            !valid_days ||
            !max_activations ||
            !percent ||
            Number(percent) > 5
        ) {
            return res
                .status(400)
                .json({ error: 'All promo fields are required' })
        }

        try {
            const result = await db.query(
                `INSERT INTO promo_codes (code,  valid_days, max_activations, percent)
                 VALUES ($1,  $2, $3, $4) RETURNING *`,
                [code.trim(), valid_days, max_activations, percent]
            )

            res.status(201).json({
                message: 'Promo code created',
                promo: result.rows[0],
            })
        } catch (err) {
            console.error('Add promo error:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deletePromo(req, res) {
        const { id } = req.body

        if (!id) {
            return res
                .status(400)
                .json({ error: 'Promo ID or code is required for deletion' })
        }

        try {
            const result = await db.query(
                `DELETE FROM promo_codes
                 WHERE id = $1
                 RETURNING *`,
                [id]
            )

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Promo code not found' })
            }

            res.json({ message: 'Promo code deleted', deleted: result.rows[0] })
        } catch (err) {
            console.error('Delete promo error:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async conflict(req, res) {
        try {
            const result = await db.query(
                `SELECT o.order_id, o.user_id, o.total_price, o.created_at, p.user_id AS seller_id, p.title, ARRAY_AGG(DISTINCT oi.post_time) AS post_times
                FROM orders AS o 
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                WHERE o.status = 'problem'
                GROUP BY o.order_id, o.total_price, o.user_id, o.created_at, p.user_id, p.title `
            )

            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async conflictFotId(req, res) {
        const order_id = req.params
        try {
            const result = await db.query(
                `SELECT * FROM orders AS oi
                JOIN orderitems oi ON o.order_id = oi.order_id
                WHERE o.order_id = $1`,
                [order_id]
            )

            res.json(result.rows[0])
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new AdminController()
