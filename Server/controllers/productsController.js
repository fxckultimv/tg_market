const db = require('../db')
const UserBalance = require('../models/UserBalance')
const Transaction = require('../models/Transaction')
const User = require('../models/User')

async function getUserIdByTelegramId(telegramId) {
    try {
        const user = await User.findOne({ telegramId }) // Ищем пользователя по telegramId
        if (!user) {
            throw new Error('User not found')
        }
        return user._id.toString() // Возвращаем _id
    } catch (error) {
        console.error('Error fetching user by telegramId:', error.message)
        throw error
    }
}

class productController {
    async product(req, res) {
        const { id } = req.params

        try {
            const result = await db.query(
                'SELECT * FROM products WHERE product_id = $1',
                [id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async products(req, res) {
        try {
            const skip = parseInt(req.query.skip) || 0
            const limit = parseInt(req.query.limit) || 10
            const search = req.query.search || ''

            // Функция для получения запроса на выборку продуктов
            const getProductsQuery = (search) => {
                if (search) {
                    return `
                        SELECT * FROM products 
                        WHERE title ILIKE $1 
                        ORDER BY created_at DESC 
                        LIMIT $2 OFFSET $3
                    `
                } else {
                    return `
                        SELECT * FROM products 
                        ORDER BY created_at DESC 
                        LIMIT $1 OFFSET $2
                    `
                }
            }

            // Функция для получения запроса на подсчет продуктов
            const getCountQuery = (search) => {
                if (search) {
                    return `
                        SELECT COUNT(*) FROM products 
                        WHERE title ILIKE $1
                    `
                } else {
                    return 'SELECT COUNT(*) FROM products'
                }
            }

            // Формирование параметров для запросов
            const productsQueryParams = search
                ? [`%${search}%`, limit, skip]
                : [limit, skip]
            const countQueryParams = search ? [`%${search}%`] : []

            // Выполнение запросов
            const [productsResult, countResult] = await Promise.all([
                db.query(getProductsQuery(search), productsQueryParams),
                db.query(getCountQuery(search), countQueryParams),
            ])

            // Формирование ответа
            res.json({
                products: productsResult.rows,
                total: parseInt(countResult.rows[0].count), // Общее количество продуктов
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async myProducts(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                'SELECT p.*, vc.channel_tg_id FROM products AS p JOIN verifiedchannels vc ON p.channel_id = vc.channel_id WHERE p.user_id = $1 ORDER BY p.created_at DESC',
                [user_id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async searchProducts(req, res) {
        const searchQuery = req.query.q || ''
        const category = req.query.category || ''
        const format = req.query.format ? req.query.format.split(',') : []
        const post_time = req.query.post_time || ''
        const minPrice = parseFloat(req.query.minPrice) || null
        const maxPrice = parseFloat(req.query.maxPrice) || null
        const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 10

        // Для пагинации нужны два запроса:
        // 1. Основной запрос для получения товаров с учетом пагинации
        // 2. Запрос для получения общего количества товаров

        let baseQuery =
            "FROM products p JOIN verifiedchannels v ON p.channel_id = v.channel_id JOIN users u ON p.user_id = u.user_id JOIN product_publication_formats ppf ON ppf.product_id = p.product_id JOIN publication_formats pf ON pf.format_id = ppf.format_id JOIN categories c ON p.category_id = c.category_id JOIN products_post_time ppt ON p.product_id = ppt.product_id  WHERE 1=1 AND p.status = 'work'"
        const params = []

        // Фильтрация по поисковому запросу
        if (searchQuery) {
            baseQuery += ` AND title ILIKE $${params.length + 1}`
            params.push(`%${searchQuery}%`)
        }

        // Фильтрация по категории
        if (category) {
            baseQuery += ` AND p.category_id = $${params.length + 1}`
            params.push(category)
        }

        // Фильтрация по формату
        if (format.length > 0) {
            const formatPlaceholders = format
                .map((_, index) => `$${params.length + index + 1}`)
                .join(', ')
            baseQuery += ` AND ppf.format_id IN (${formatPlaceholders})`
            params.push(...format)
        }

        // Фильтрация по времени публикации
        if (post_time) {
            baseQuery += ` AND post_time = $${params.length + 1}`
            params.push(post_time)
        }

        // Фильтрация по минимальной цене
        if (minPrice !== null) {
            baseQuery += ` AND price >= $${params.length + 1}`
            params.push(minPrice)
        }

        // Фильтрация по максимальной цене
        if (maxPrice !== null) {
            baseQuery += ` AND price <= $${params.length + 1}`
            params.push(maxPrice)
        }

        // 1. Запрос для получения товаров с учетом лимита и смещения
        let productQuery = `SELECT p.product_id, p.category_id, p.title, p.price, p.channel_id, c.category_name, jsonb_object_agg(ppf.format_id, pf.format_name) AS formats, 
    ARRAY_AGG(DISTINCT ppt.post_time) AS post_times, ARRAY_AGG(DISTINCT ppt.post_time) AS post_times, v.channel_tg_id, v.subscribers_count, v.views, v.subscribers_count, u.rating ${baseQuery} GROUP BY 
    p.product_id, 
    v.channel_tg_id, 
    v.subscribers_count, 
    v.views, 
    c.category_name,
    u.rating  ORDER BY price ${sort}  LIMIT $${params.length + 1} OFFSET $${
            params.length + 2
        }`
        params.push(limit)
        params.push(skip)

        // 2. Запрос для получения общего количества товаров (без лимита и смещения)
        let countQuery = `SELECT COUNT(DISTINCT p.product_id) ${baseQuery}`

        try {
            // Выполняем оба запроса параллельно
            const [productResult, countResult] = await Promise.all([
                db.query(productQuery, params),
                db.query(countQuery, params.slice(0, -2)), // Параметры для запроса без лимита и смещения
            ])

            const totalProducts = parseInt(countResult.rows[0].count, 10)

            if (productResult.rows.length > 0) {
                res.json({
                    products: productResult.rows,
                    totalProducts, // Общее количество товаров
                    totalPages: Math.ceil(totalProducts / limit), // Количество страниц
                    currentPage: Math.floor(skip / limit) + 1, // Текущая страница
                })
            } else {
                res.status(404).json({ error: 'Products not found' })
            }
        } catch (err) {
            console.error('Error fetching products from database:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async userProducts(req, res) {
        const searchQuery = req.query.q || ''
        const user_uuid = req.query.user_uuid
        const category = req.query.category || ''
        const format = req.query.format ? req.query.format.split(',') : []
        const post_time = req.query.post_time || ''
        const minPrice = parseFloat(req.query.minPrice) || null
        const maxPrice = parseFloat(req.query.maxPrice) || null
        const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC'
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 10

        // Для пагинации нужны два запроса:
        // 1. Основной запрос для получения товаров с учетом пагинации
        // 2. Запрос для получения общего количества товаров

        let baseQuery = `FROM products p JOIN verifiedchannels v ON p.channel_id = v.channel_id JOIN users u ON p.user_id = u.user_id JOIN product_publication_formats ppf ON ppf.product_id = p.product_id WHERE u.user_uuid = $1 AND p.status = 'work'`
        const params = [user_uuid]

        // Фильтрация по поисковому запросу
        if (searchQuery) {
            baseQuery += ` AND title ILIKE $${params.length + 1}`
            params.push(`%${searchQuery}%`)
        }

        // Фильтрация по категории
        if (category) {
            baseQuery += ` AND category_id = $${params.length + 1}`
            params.push(category)
        }

        // Фильтрация по формату
        if (format.length > 0) {
            const formatPlaceholders = format
                .map((_, index) => `$${params.length + index + 1}`)
                .join(', ')
            baseQuery += ` AND ppf.format_id IN (${formatPlaceholders})`
            params.push(...format)
        }

        // Фильтрация по времени публикации
        if (post_time) {
            baseQuery += ` AND post_time = $${params.length + 1}`
            params.push(post_time)
        }

        // Фильтрация по минимальной цене
        if (minPrice !== null) {
            baseQuery += ` AND price >= $${params.length + 1}`
            params.push(minPrice)
        }

        // Фильтрация по максимальной цене
        if (maxPrice !== null) {
            baseQuery += ` AND price <= $${params.length + 1}`
            params.push(maxPrice)
        }

        // 1. Запрос для получения товаров с учетом лимита и смещения
        let productQuery = `SELECT p.product_id, p.category_id, p.title, p.price, p.channel_id, ARRAY_AGG(ppf.format_id) AS format_ids, v.channel_tg_id, v.subscribers_count, v.views, u.rating ${baseQuery} GROUP BY 
    p.product_id, 
    v.channel_tg_id, 
    v.subscribers_count, 
    v.views,
    u.rating  ORDER BY price ${sort}  LIMIT $${params.length + 1} OFFSET $${
            params.length + 2
        }`
        params.push(limit)
        params.push(skip)

        // 2. Запрос для получения общего количества товаров (без лимита и смещения)
        let countQuery = `SELECT COUNT(*) ${baseQuery}`

        try {
            // Выполняем оба запроса параллельно
            const [productResult, countResult] = await Promise.all([
                db.query(productQuery, params),
                db.query(countQuery, params.slice(0, -2)), // Параметры для запроса без лимита и смещения
            ])

            const totalProducts = parseInt(countResult.rows[0].count, 10)

            if (productResult.rows.length > 0) {
                res.json({
                    products: productResult.rows,
                    totalProducts, // Общее количество товаров
                    totalPages: Math.ceil(totalProducts / limit), // Количество страниц
                    currentPage: Math.floor(skip / limit) + 1, // Текущая страница
                })
            } else {
                res.status(404).json({ error: 'Products not found' })
            }
        } catch (err) {
            console.error('Error fetching products from database:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async productDetails(req, res) {
        const { id } = req.params

        try {
            const result = await db.query(
                `SELECT p.*, v.channel_name, v.channel_title, v.is_verified, v.channel_url , v.channel_tg_id, v.views, v.subscribers_count, u.rating, u.user_uuid, u.username,
                COALESCE(ARRAY_AGG(DISTINCT ppf.format_id), ARRAY[]::INTEGER[]) AS format_ids, COALESCE(ARRAY_AGG(DISTINCT ppt.post_time), ARRAY[]::time with time zone[]) AS post_times
                FROM products p
                LEFT JOIN verifiedchannels v ON p.channel_id = v.channel_id
                LEFT JOIN users u ON p.user_id = u.user_id
                LEFT JOIN product_publication_formats ppf ON ppf.product_id = p.product_id
                LEFT JOIN products_post_time ppt ON p.product_id = ppt.product_id
                WHERE p.product_id = $1
                GROUP BY p.product_id, v.channel_name,v.channel_title, v.is_verified, v.channel_url, v.channel_tg_id, u.rating, u.user_uuid, u.username, v.views, v.subscribers_count`,
                [id]
            )

            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error('Error fetching product details from database:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async addProduct(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const {
            channel_id,
            category_id,
            description,
            price,
            post_time,
            format,
        } = req.body

        const isUnique = (arr) => new Set(arr).size === arr.length

        if (
            !channel_id ||
            !category_id ||
            !description ||
            description.trim().length === 0 ||
            !format ||
            !Array.isArray(format) ||
            format.length === 0 ||
            !post_time ||
            !Array.isArray(post_time) ||
            post_time.length === 0 ||
            price < 0.1 ||
            !isUnique(post_time)
        ) {
            return res
                .status(400)
                .json({ error: 'Некорректные входные данные' })
        }

        try {
            const productPublished = await db.query(
                `SELECT * FROM products WHERE channel_id = $1`,
                [channel_id]
            )

            if (productPublished.rows.length > 0) {
                return res
                    .status(403)
                    .json({ error: 'Для этого канала уже есть продукт' })
            }
            // Проверка, верифицирован ли канал и получение channel_name
            const verificationResult = await db.query(
                `SELECT channel_name, channel_title FROM verifiedchannels WHERE user_id = $1 AND channel_id = $2`,
                [user_id, channel_id]
            )

            // Если канал не найден или не верифицирован, возвращаем ошибку
            if (verificationResult.rows.length === 0) {
                return res
                    .status(403)
                    .json({ error: 'Канал не верифицирован или не найден' })
            }

            // Получаем channel_name
            const channel_name = verificationResult.rows[0].channel_name
            const channel_title = verificationResult.rows[0].channel_title

            // Добавляем новый продукт с использованием channel_name в качестве title
            const result = await db.query(
                `INSERT INTO products (user_id, category_id, title, description, price, post_time, channel_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    user_id,
                    category_id,
                    channel_title,
                    description,
                    price,
                    post_time[0],
                    channel_id,
                    'work',
                ]
            )

            const product_id = result.rows[0].product_id

            // Добавление каждого элемента массива format в таблицу product_publication_formats
            for (let i = 0; i < format.length; i++) {
                await db.query(
                    `INSERT INTO product_publication_formats (product_id, format_id) VALUES ($1, $2)`,
                    [product_id, format[i]]
                )
            }

            // Добавление каждого элемента массива post_time в таблицу product_post_time
            for (let i = 0; i < post_time.length; i++) {
                await db.query(
                    `INSERT INTO products_post_time (product_id, post_time) VALUES ($1, $2)`,
                    [product_id, post_time[i]]
                )
            }

            // Возвращаем добавленный продукт
            res.status(201).json({ message: 'Product added successfully' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async editProduct(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const {
            channel_id,
            product_id: reqProduct_id,
            category_id,
            description,
            price,
            post_time,
            format,
        } = req.body

        const isUnique = (arr) => new Set(arr).size === arr.length

        if (
            !channel_id ||
            !reqProduct_id ||
            !category_id ||
            !description ||
            description.trim().length === 0 ||
            !format ||
            !Array.isArray(format) ||
            format.length === 0 ||
            !post_time ||
            !Array.isArray(post_time) ||
            post_time.length === 0 ||
            price < 0.1 ||
            !isUnique(post_time)
        ) {
            return res
                .status(400)
                .json({ error: 'Некорректные входные данные' })
        }

        try {
            // Проверка, верифицирован ли канал и получение channel_name
            const verificationResult = await db.query(
                `SELECT channel_name FROM verifiedchannels WHERE user_id = $1 AND channel_id = $2`,
                [user_id, channel_id]
            )

            // Если канал не найден или не верифицирован, возвращаем ошибку
            if (verificationResult.rows.length === 0) {
                return res
                    .status(403)
                    .json({ error: 'Канал не верифицирован или не найден' })
            }

            // Получаем channel_name
            const channel_name = verificationResult.rows[0].channel_name

            // Обновляем основной продукт
            const result = await db.query(
                `UPDATE products
                SET category_id = $1, description = $2, price = $3, post_time = $4
                WHERE product_id = $5 AND user_id = $6
                RETURNING *`,
                [
                    category_id,
                    description,
                    price,
                    post_time[0],
                    reqProduct_id,
                    user_id,
                ]
            )

            // Если продукт не найден, возвращаем ошибку
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Продукт не найден' })
            }

            const product_id = result.rows[0].product_id

            // Удаляем старые форматы публикации и время публикации, чтобы вставить новые
            await db.query(
                `DELETE FROM product_publication_formats WHERE product_id = $1`,
                [product_id]
            )
            await db.query(
                `DELETE FROM products_post_time WHERE product_id = $1`,
                [product_id]
            )

            // Добавление каждого элемента массива format в таблицу product_publication_formats
            for (let i = 0; i < format.length; i++) {
                await db.query(
                    `INSERT INTO product_publication_formats (product_id, format_id) VALUES ($1, $2)`,
                    [product_id, format[i]]
                )
            }

            // Добавление каждого элемента массива post_time в таблицу products_post_time
            for (let i = 0; i < post_time.length; i++) {
                await db.query(
                    `INSERT INTO products_post_time (product_id, post_time) VALUES ($1, $2)`,
                    [product_id, post_time[i]]
                )
            }

            // Возвращаем обновленный продукт
            res.status(200).json({ message: 'Product updated successfully' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async busyDayProducts(req, res) {
        const { id } = req.params

        try {
            const result = await db.query(
                `SELECT oi.post_time  FROM products p
                JOIN orderitems oi ON p.product_id = oi.product_id
                JOIN orders o ON oi.order_id = o.order_id
                WHERE p.product_id = $1 AND o.status IN ('pending_payment', 'paid', 'complited', 'completed') AND oi.post_time IS NOT NULL`,
                [id]
            )

            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'Busy day not found' })
            }
        } catch (err) {
            console.error('Error fetching product details from database:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async deleteProduct(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        const { product_id } = req.body
        try {
            const result = await db.query(
                'DELETE FROM products WHERE product_id=$1 AND user_id = $2 RETURNING *',
                [product_id, user_id]
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

    async pauseProduct(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { id } = req.params
        const { status } = req.body

        try {
            const result = await db.query(
                'UPDATE products SET status = $1 WHERE product_id = $2 AND user_id = $3',
                [status, id, user_id]
            )
            if (result.rowCount > 0) {
                res.status(200).json({ message: 'Successfully product pause' })
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async similarProduct(req, res) {
        const { price, format_id } = req.body

        try {
            const result = await db.query(
                `SELECT p.*, ppf.format_id 
                FROM products AS p
                JOIN product_publication_formats ppf ON ppf.product_id = p.product_id
                WHERE p.category_id = p.category_id 
                AND p.price BETWEEN $1 * 0.5 AND $1 * 2
                AND ppf.format_id = $2
                ORDER BY price DESC 
                LIMIT 10`,
                [price, format_id]
            )

            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error('Error fetching product details from database:', err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async confirmation(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { id } = req.params

        try {
            // Первичная проверка в базе данных
            const checkResult = await db.query(
                `SELECT o.order_id, o.total_price, o.status, o.user_id AS buyerId, p.user_id, p.title,
                    ARRAY_AGG(DISTINCT oi.post_time) as post_times
                FROM orders AS o
                JOIN orderitems oi ON o.order_id = oi.order_id
                JOIN products p ON p.product_id = oi.product_id
                WHERE o.order_id = $1 AND o.user_id = $2
                GROUP BY o.order_id, o.status, p.user_id, o.total_price, o.user_id, p.title`,
                [id, user_id]
            )

            if (checkResult.rows.length > 0) {
                const order = checkResult.rows[0]

                // Проверяем, что статус 'paid' и все даты позже текущего времени
                const now = new Date()
                const allDatesInFuture =
                    Array.isArray(order.post_times) &&
                    order.post_times.every((time) => new Date(time) < now)

                if (order.status === 'paid' && allDatesInFuture) {
                    // Если проверки выполнены, обновляем статус заказа
                    const result = await db.query(
                        `UPDATE orders 
                         SET status = 'completed' 
                         WHERE user_id = $1 AND order_id = $2 AND status = 'paid'`,
                        [user_id, id]
                    )

                    if (result.rowCount > 0) {
                        const amount = order.total_price
                        const buyerId = order.buyerId
                        const order_id = order.order_id

                        const sellerId = await getUserIdByTelegramId(
                            order.user_id
                        )
                        const refCheck = await db.query(
                            `SELECT referrer_id 
                               FROM referrals
                              WHERE referred_id = $1
                              LIMIT 1`,
                            [user_id]
                        )
                        console.log('buyerID: ', buyerId)

                        const platformCommission = Math.round(amount * 0.07) // комиссия платформы
                        let referrerShare = 0

                        // Если нашли реферера
                        if (refCheck.rows.length > 0) {
                            const referrerTgId = refCheck.rows[0].referrer_id

                            const referrerId = await getUserIdByTelegramId(
                                refCheck.rows[0].referrer_id
                            )
                            console.log('referrerId: ', referrerId)

                            const referrerTurnoverResult = await db.query(
                                `SELECT COALESCE(SUM(partner_commission), 0) AS total_sum
                                 FROM referral_commissions
                                 WHERE referrer_id = $1`,
                                [referrerId]
                            )

                            const referrerTurnover =
                                parseFloat(
                                    referrerTurnoverResult.rows[0].total_sum
                                ) || 0

                            // Вычисляем процент партнёрского вознаграждения в зависимости от оборота
                            let partnerPercent = 0.5 // по умолчанию 10%

                            if (referrerTurnover >= 100_000_000_000) {
                                partnerPercent = 0.2
                            } else if (referrerTurnover >= 25_000_000_000) {
                                partnerPercent = 0.25
                            } else if (referrerTurnover >= 10_000_000_000) {
                                partnerPercent = 0.3
                            } else if (referrerTurnover >= 5_000_000_000) {
                                partnerPercent = 0.35
                            } else if (referrerTurnover >= 1_000_000_000) {
                                partnerPercent = 0.4
                            }

                            // Теперь считаем вознаграждение
                            const referrerShare = Math.round(
                                platformCommission * partnerPercent
                            )

                            // Начисляем рефереру
                            const referrerUpdate =
                                await UserBalance.findOneAndUpdate(
                                    { userId: referrerId },
                                    { $inc: { balance: referrerShare } },
                                    { new: true, runValidators: true }
                                )

                            // Логгируем транзакцию для реферера (если хотите)
                            if (referrerUpdate) {
                                await Transaction.create({
                                    userId: referrerId,
                                    type: 'purchase',
                                    amount: referrerShare,
                                    fee: 0,
                                    status: 'completed',
                                    details: { order_id, buyerId },
                                })
                            }
                            await db.query(
                                `INSERT INTO referral_commissions 
                                 (order_id, user_id, referrer_id, platform_commission, partner_commission)
                                 VALUES ($1, $2, $3, $4, $5)`,
                                [
                                    order_id,
                                    user_id,
                                    referrerId,
                                    platformCommission,
                                    referrerShare,
                                ]
                            )
                        }

                        const sellerAmount = amount - platformCommission

                        const sellerUpdate = await UserBalance.findOneAndUpdate(
                            { userId: sellerId },
                            { $inc: { balance: sellerAmount } },
                            { new: true, runValidators: true }
                        )

                        if (!sellerUpdate) {
                            await UserBalance.findOneAndUpdate(
                                { userId: buyerId },
                                { $inc: { balance: totalAmount } }
                            )
                            return res.status(500).json({
                                error: 'Не удалось обновить баланс продавца',
                            })
                        }

                        const [sellerTransaction] = await Promise.all([
                            Transaction.create({
                                userId: sellerId,
                                type: 'purchase',
                                amount,
                                fee: 0,
                                status: 'completed',
                                details: { order_id, buyerId },
                            }),
                        ])

                        const requestBody = {
                            user_id: order.user_id,
                            order_id: order_id,
                            channel_name: order.title,
                            price: amount,
                        }

                        console.log(requestBody)

                        const response = await fetch(
                            'http://localhost:5001/confirmation',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestBody),
                            }
                        )

                        if (!response.ok) {
                            throw new Error(
                                `Error from POST request: ${response.statusText}`
                            )
                        }

                        const data = await response.json()

                        res.status(200).json({
                            message:
                                'Order status updated successfully and POST request sent successfully',
                            sellerTransaction: sellerTransaction._id,
                        })
                    } else {
                        res.status(404).json({
                            error: 'Order not found or already completed',
                        })
                    }
                } else {
                    res.status(403).json({
                        error: 'Invalid status or post times not valid',
                    })
                }
            } else {
                res.status(403).json({ error: 'Unauthorized or not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new productController()
