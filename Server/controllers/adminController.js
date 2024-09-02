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
            const newUsersToday = await db.query(
                'SELECT COUNT(*) FROM users WHERE created_at >= $1',
                [startOfDay]
            )
            const newUsersThisWeek = await db.query(
                'SELECT COUNT(*) FROM users WHERE created_at >= $1',
                [startOfWeek]
            )
            const newUsersThisMonth = await db.query(
                'SELECT COUNT(*) FROM users WHERE created_at >= $1',
                [startOfMonth]
            )
            const newUsersThisYear = await db.query(
                'SELECT COUNT(*) FROM users WHERE created_at >= $1',
                [startOfYear]
            )

            // Запросы для продуктов
            const totalProducts = await db.query(
                'SELECT COUNT(*) FROM products'
            )
            const newProductsToday = await db.query(
                'SELECT COUNT(*) FROM products WHERE created_at >= $1',
                [startOfDay]
            )
            const newProductsThisWeek = await db.query(
                'SELECT COUNT(*) FROM products WHERE created_at >= $1',
                [startOfWeek]
            )
            const newProductsThisMonth = await db.query(
                'SELECT COUNT(*) FROM products WHERE created_at >= $1',
                [startOfMonth]
            )
            const newProductsThisYear = await db.query(
                'SELECT COUNT(*) FROM products WHERE created_at >= $1',
                [startOfYear]
            )

            // Запросы для заказов
            const totalOrders = await db.query('SELECT COUNT(*) FROM orders')
            const newOrdersToday = await db.query(
                'SELECT COUNT(*) FROM orders WHERE created_at >= $1',
                [startOfDay]
            )
            const newOrdersThisWeek = await db.query(
                'SELECT COUNT(*) FROM orders WHERE created_at >= $1',
                [startOfWeek]
            )
            const newOrdersThisMonth = await db.query(
                'SELECT COUNT(*) FROM orders WHERE created_at >= $1',
                [startOfMonth]
            )
            const newOrdersThisYear = await db.query(
                'SELECT COUNT(*) FROM orders WHERE created_at >= $1',
                [startOfYear]
            )

            // Запрос для общего оборота
            const totalRevenue = await db.query(
                'SELECT SUM(total_price) FROM orders'
            )

            res.json({
                totalUsers: totalUsers.rows[0].count,
                newUsersToday: newUsersToday.rows[0].count,
                newUsersThisWeek: newUsersThisWeek.rows[0].count,
                newUsersThisMonth: newUsersThisMonth.rows[0].count,
                newUsersThisYear: newUsersThisYear.rows[0].count,
                totalProducts: totalProducts.rows[0].count,
                newProductsToday: newProductsToday.rows[0].count,
                newProductsThisWeek: newProductsThisWeek.rows[0].count,
                newProductsThisMonth: newProductsThisMonth.rows[0].count,
                newProductsThisYear: newProductsThisYear.rows[0].count,
                totalOrders: totalOrders.rows[0].count,
                newOrdersToday: newOrdersToday.rows[0].count,
                newOrdersThisWeek: newOrdersThisWeek.rows[0].count,
                newOrdersThisMonth: newOrdersThisMonth.rows[0].count,
                newOrdersThisYear: newOrdersThisYear.rows[0].count,
                totalRevenue: totalRevenue.rows[0].sum || 0,
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async users(req, res) {
        try {
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10
            const search = req.query.search || ''

            const getUsersQuery = () => {
                return `SELECT * FROM users
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2`
            }

            const getCountQuery = () => {
                return 'SELECT COUNT(*) FROM users'
            }

            // Формирование параметров для запросов
            const usersQueryParams = [limit, skip]

            // Выполнение запросов параллельно
            const [usersResult, countResult] = await Promise.all([
                db.query(getUsersQuery(), usersQueryParams),
                db.query(getCountQuery()),
            ])

            // Формирование ответа
            res.json({
                users: usersResult.rows,
                total: parseInt(countResult.rows[0].count), // Общее количество заказов
            })
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
        console.log(category_id)

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
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10
            const search = req.query.search || ''

            // Функция для получения запроса на выборку заказов
            const getOrdersQuery = () => {
                return `
                    SELECT * FROM orders 
                    ORDER BY created_at DESC 
                    LIMIT $1 OFFSET $2
                `
            }

            // Функция для получения запроса на подсчет заказов
            const getCountQuery = () => {
                return 'SELECT COUNT(*) FROM orders'
            }

            // Формирование параметров для запросов
            const ordersQueryParams = [limit, skip]

            // Выполнение запросов параллельно
            const [ordersResult, countResult] = await Promise.all([
                db.query(getOrdersQuery(), ordersQueryParams),
                db.query(getCountQuery()),
            ])

            // Формирование ответа
            res.json({
                orders: ordersResult.rows,
                total: parseInt(countResult.rows[0].count), // Общее количество заказов
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async order(req, res) {
        const { id } = req.params
        try {
            const result = await db.query(
                `SELECT * FROM orders WHERE order_id = $1`,
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(204).send() // Возвращаем статус 204, если данных нет
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

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
        console.log(`Продукт ${product_id} был удалён`)

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
}

module.exports = new AdminController()
