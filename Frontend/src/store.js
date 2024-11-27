import { DecadeView } from 'react-calendar'
import { create } from 'zustand'

export const useAdminStore = create((set) => ({
    isAdmin: false,
    stats: [],
    users: [],
    user: {},
    products: [],
    product: [],
    orders: [],
    order: [],
    orderDetails: [],
    categories: [],
    carts: [],

    checkAdmin: async (initDataRaw) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/check_admin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            const data = await response.json()

            if (data.isAdmin) {
                set({ isAdmin: true, loading: false })
            } else {
                set({ isAdmin: false, loading: false })
                // navigate('/')
            }
        } catch (error) {
            console.error('Ошибка при проверке прав администратора:', error)
            set({
                error: 'Ошибка при проверке прав администратора',
                loading: false,
            })
            // navigate('/')
        }
    },
    fetchStats: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/admin_stats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ stats: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ stats: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchUsers: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch(
                'http://localhost:5000/admin_stats/users',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ users: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ users: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchUsers: async (initDataRaw, skip = 0, limit = 10) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/users?skip=${skip}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ users: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ users: data.users, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchUserForId: async (initDataRaw, user_id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/users/${user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ user: [], loading: false })
                return []
            }
            const data = await response.json()
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchAllProducts: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ products: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ products: data.products, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchProducts: async (initDataRaw, skip = 0, limit = 10) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/products?skip=${skip}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ products: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ products: data.products, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchProductsForId: async (initDataRaw, product_id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/products/${product_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ product: [], loading: false })
                return []
            }
            const data = await response.json()
            set({ product: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },

    fetchProductsForUser: async (initDataRaw, user_id) => {
        set({ loading: true })

        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/users/${user_id}/products`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ products: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ products: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    deleteProduct: async (initDataRaw, productID) => {
        set({ loading: true, error: null })
        console.log('delete', productID)

        try {
            const response = await fetch(
                `http://localhost:5000/products/admin/${productID}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Ошибка при удалении продукта')
            }

            set((state) => ({
                products: state.products.filter(
                    (product) => product.product_id !== productID // Исправлено на `categoryID`
                ),
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error)
            set({ error: 'Ошибка при удалении продукта', loading: false })
        }
    },

    // fetchOrders: async (initDataRaw) => {
    //     set({ loading: true })
    //     try {
    //         const response = await fetch('http://localhost:5000/orders/all', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `tma ${initDataRaw}`,
    //             },
    //         })
    //         if (response.status === 204) {
    //             // Если сервер вернул 204, устанавливаем пустой массив
    //             set({ orders: [], loading: false })
    //             return []
    //         }
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok')
    //         }
    //         const data = await response.json()
    //         set({ orders: data.orders, loading: false })
    //     } catch (error) {
    //         set({ loading: false })
    //         console.error('Error:', error)
    //     }
    // },
    fetchOrders: async (initDataRaw, skip = 0, limit = 10) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/orders?skip=${skip}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ orders: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ orders: data.orders, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },

    fetchOrdersForUser: async (initDataRaw, user_id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/orders/user/${user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ orders: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ orders: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchOrdersForId: async (initDataRaw, order_id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/orders/${order_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ order: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ order: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchOrdersDetails: async (initDataRaw, order_id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/orders/details/${order_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ orderDetails: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ orderDetails: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },

    fetchCategories: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch(
                'http://localhost:5000/admin_stats/categories',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ categories: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ categories: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    addCategory: async (initDataRaw, categoryName) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                'http://localhost:5000/admin_stats/categories',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({ category_name: categoryName }),
                }
            )

            if (!response.ok) {
                throw new Error('Ошибка при добавлении категории')
            }

            const newCategory = await response.json()
            set((state) => ({
                categories: [...state.categories, newCategory],
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error)
            set({ error: 'Ошибка при добавлении категории', loading: false })
        }
    },
    deleteCategory: async (initDataRaw, categoryID) => {
        set({ loading: true, error: null })
        console.log('delete', categoryID)

        try {
            const response = await fetch(
                'http://localhost:5000/admin_stats/categories',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({ category_id: categoryID }),
                }
            )

            if (!response.ok) {
                throw new Error('Ошибка при удалении категории')
            }

            set((state) => ({
                categories: state.categories.filter(
                    (category) => category.category_id !== categoryID // Исправлено на `categoryID`
                ),
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при удалении категории:', error)
            set({ error: 'Ошибка при удалении категории', loading: false })
        }
    },
    patchCategory: async (initDataRaw, categoryID, category_name) => {
        set({ loading: true, error: null })
        console.log('patch', categoryID, ' ', category_name)

        try {
            const response = await fetch(
                'http://localhost:5000/admin_stats/categories',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({
                        category_id: categoryID,
                        category_name: category_name,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('Ошибка при удалении категории')
            }

            set((state) => ({
                categories: state.categories.filter(
                    (category) => category.category_id !== categoryID // Исправлено на `categoryID`
                ),
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при удалении категории:', error)
            set({ error: 'Ошибка при удалении категории', loading: false })
        }
    },
    fetchCartForUser: async (initDataRaw, user_id) => {
        set({ loading: true })

        try {
            const response = await fetch(
                `http://localhost:5000/admin_stats/cart/${user_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ carts: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ carts: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
}))

export const useUserStore = create((set) => ({
    initData: [],
    setInitData: (data) => set({ initData: data }),
    theme: 'light', // начальное значение темы по умолчанию
    setTheme: (newTheme) => set({ theme: newTheme }), // метод для смены темы
    cart: [],
    user: [],
    verifiedChannels: [],
    categories: [],
    formats: [],
    history: [],
    reviews: [],
    balance: 0,
    status: false,
    fetchAuth: async (initDataRaw) => {
        set({ loading: true, error: null })
        console.log('initDateRaw ', initDataRaw)

        try {
            const response = await fetch('http://localhost:5000/auth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            console.log(data)
            set({ loading: false })
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
            // navigate('/')
        }
    },
    fetchCart: async (initDataRaw) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ cart: [], loading: false })
                return []
            }
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ cart: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchBalance: async (initDataRaw) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                'http://localhost:5000/balance/balance?id=801541001',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ balance: data.balance, loading: false })
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
            // navigate('/')
        }
    },
    fetchCategories: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ categories: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ categories: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchFormats: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/formats', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ formats: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ formats: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchVerifiedChannels: async (initDataRaw) => {
        set({ loading: true, error: null })
        console.log('initDateRaw ', initDataRaw)

        try {
            const response = await fetch('http://localhost:5000/channels', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ verifiedChannels: [], loading: false })
                return []
            }
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ verifiedChannels: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchHistory: async (initDataRaw, status, limit, offset) => {
        set({ loading: true, error: null })
        const url = status
            ? `http://localhost:5000/history?status=${status}&limit=${limit}&offset=${offset}`
            : `http://localhost:5000/history?limit=${limit}&offset=${offset}`

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ history: [], loading: false })
                return []
            }
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ history: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },
    appendHistory: async (initDataRaw, status, limit, offset) => {
        set({ loading: true, error: null })

        try {
            const query = status
                ? `http://localhost:5000/history?status=${status}&limit=${limit}&offset=${offset}`
                : `http://localhost:5000/history?limit=${limit}&offset=${offset}`

            const response = await fetch(query, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set((state) => ({
                history: [...state.history, ...data],
                loading: false,
            }))
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            return null
        }
    },

    addProduct: async (
        initDataRaw,
        { channel_id, category_id, description, price, post_time, format }
    ) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/products/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({
                    channel_id,
                    category_id,
                    description,
                    price,
                    post_time,
                    format,
                }),
            })

            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ verifiedChannels: [], loading: false })
                return []
            }

            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },

    createOrder: async (initDataRaw, cart_item_ids) => {
        try {
            const response = await fetch('http://localhost:5000/orders/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({ cart_item_id: cart_item_ids }),
            })

            if (!response.ok) {
                throw new Error('Ошибка при создании заказа')
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },
    deleteCartItem: async (initDataRaw, cart_item_ids) => {
        try {
            const response = await fetch('http://localhost:5000/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({ cart_item_id: cart_item_ids }),
            })

            if (!response.ok) {
                throw new Error('Ошибка при удалении товара')
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },
    buyProduct: async (initDataRaw, order_id) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({ order_id }),
            })

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ loading: false, error: null })
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },
    checkingStatus: async (initDataRaw, order_id) => {
        set({ loading: true, error: null })

        // Проверка корректности order_id перед запросом
        if (!order_id || isNaN(order_id)) {
            set({ error: 'Invalid order ID', loading: false })
            return null
        }

        try {
            const response = await fetch(
                `http://localhost:5000/orders/status/${order_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            // Проверка успешности запроса
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()

            set({ status: data.status, loading: false, error: null }) // Обновляем статус
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchUser: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(`http://localhost:5000/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchMe: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch(`http://localhost:5000/user/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchReviews: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/user/reviews/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ reviews: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
}))

export const useProductStore = create((set, get) => ({
    categories: [],
    reviews: [],
    cart: [],
    products: [],
    myProducts: [],
    productDetails: null,
    userProducts: [],
    busyDay: [],
    order_stats: [],
    searchQuery: '',
    page: 1, // Начальная страница
    totalPages: 1,
    filters: {
        category: '',
        priceRange: [0, 1000000],
    },
    setPage: (newPage) => set({ page: newPage }),
    plusPage: () => set({ page: get().page + 1 }), // Увеличение страницы на 1
    minusPage: () => set({ page: get().page - 1 }),
    setProducts: (products) => ({ products }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

    fetchProducts: async (initDataRaw) => {
        set({ isLoading: true })
        const { searchQuery, filters, page } = get()

        const limit = 10
        const skip = (page - 1) * limit

        try {
            const queryParams = new URLSearchParams({
                q: searchQuery || '',
                category: filters.category || '',
                format: filters.format || '',
                minPrice: filters.priceRange
                    ? filters.priceRange[0].toString()
                    : '',
                maxPrice: filters.priceRange
                    ? filters.priceRange[1].toString()
                    : '',
                skip: skip.toString(),
                limit: limit.toString(),
            }).toString()

            const response = await fetch(
                `http://localhost:5000/products/search?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            const data = await response.json()

            set({
                products: data.products,
                totalPages: data.totalPages || 1,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ products: [], isLoading: false })
        }
    },
    fetchProductDetails: async (initDataRaw, productId) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/products/details/${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch product details')
            }

            const data = await response.json()
            set({ productDetails: data, loading: false })
        } catch (error) {
            console.error('Error fetching product details:', error)
            set({ error: error.message, loading: false })
        }
    },
    updateProductDetails: async (initDataRaw, updatedDetails) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                'http://localhost:5000/products/edit',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify(updatedDetails),
                }
            )
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`)
            }

            const data = await response.json()
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            return null
        }
    },
    fetchUserProducts: async (initDataRaw, user_uuid) => {
        set({ isLoading: true })
        const { searchQuery, filters, page } = get()

        const limit = 10
        const skip = (page - 1) * limit

        try {
            const queryParams = new URLSearchParams({
                q: searchQuery || '',
                user_uuid: user_uuid,
                category: filters.category || '',
                format: filters.format || '',
                minPrice: filters.priceRange
                    ? filters.priceRange[0].toString()
                    : '',
                maxPrice: filters.priceRange
                    ? filters.priceRange[1].toString()
                    : '',
                skip: skip.toString(),
                limit: limit.toString(),
            }).toString()

            const response = await fetch(
                `http://localhost:5000/products/user?${queryParams}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            const data = await response.json()

            set({
                userProducts: data.products,
                totalPages: data.totalPages || 1,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ userProducts: [], isLoading: false })
        }
    },
    fetchMyProducts: async (initDataRaw) => {
        set({ isLoading: true, error: null })
        try {
            const response = await fetch(`http://localhost:5000/products/my`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            const data = await response.json()

            set({
                myProducts: data,
                isLoading: false,
            })
            return data
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ myProducts: [], isLoading: false })
            return null
        }
    },
    fetchBusyDay: async (initDataRaw, productId) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/products/busy_day/${productId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204 || response.status === 404) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ busyDay: [], loading: false })
                return []
            }

            if (!response.ok) {
                throw new Error('Failed to fetch product details')
            }

            const data = await response.json()
            // Преобразование данных: извлекаем даты из каждого объекта
            const busyDaysArray = data.flatMap((item) => item.post_time) // Собираем все даты из массива post_time

            // console.log('Busy days:', busyDaysArray)

            set({ busyDay: busyDaysArray, loading: false })
        } catch (error) {
            console.error('Error fetching product details:', error)
            set({ error: error.message, loading: false })
        }
    },

    fetchCategories: async (initDataRaw) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ categories: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ categories: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    fetchOrderStats: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/product_stats/order?channel_id=${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ order_stats: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ order_stats: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    addToCart: async (initDataRaw, cartInfo) => {
        set({ loading: true })
        try {
            const response = await fetch('http://localhost:5000/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify(cartInfo),
            })

            if (response.status === 204) {
                // Если сервер вернул 204, устанавливаем пустой массив
                set({ categories: [], loading: false })
                return []
            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            console.log(data)
            set({ loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
    createOrder: async (initDataRaw, cart_item_ids) => {
        try {
            const response = await fetch('http://localhost:5000/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({ cart_item_id: cart_item_ids }),
            })

            if (!response.ok) {
                throw new Error('Ошибка при создании заказа')
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },
    fetchReviews: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/user/reviews/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            set({ reviews: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
        }
    },
}))
