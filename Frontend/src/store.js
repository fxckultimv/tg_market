import { data } from 'autoprefixer'
import { DecadeView } from 'react-calendar'
import { create } from 'zustand'
import { nanoTonToTon, tonToNanoTon } from './utils/tonConversion'

export const handleServerResponse = async (response, set) => {
    const { setSessionExpired } = useUserStore.getState() // Получаем метод из хранилища

    if (response.status === 401) {
        setSessionExpired(true) // Устанавливаем состояние истечения сессии
        return null
    }

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
    }

    setSessionExpired(false)
    return await response.json()
}

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
            const data = await handleServerResponse(response, set)

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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)

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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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
            const data = await handleServerResponse(response, set)
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

            const data = await handleServerResponse(response, set)
            set((state) => ({
                categories: [...state.categories, data],
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error)
            set({ error: 'Ошибка при добавлении категории', loading: false })
        }
    },
    deleteCategory: async (initDataRaw, categoryID) => {
        set({ loading: true, error: null })

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
            const data = await handleServerResponse(response, set)

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
            const data = await handleServerResponse(response, set)

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
            const data = await handleServerResponse(response, set)
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
    sessionExpired: false, // Состояние для модального окна сессии
    setSessionExpired: (value) => set({ sessionExpired: value }), // Метод для обновления состояния сиссии
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
    singleHistory: [],
    reviews: [],
    balance: 0,
    orderInfo: [],
    referral: [],
    fetchAuth: async (initDataRaw) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/auth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            const data = await handleServerResponse(response, set)
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
                set({ cart: [], loading: false })
                return []
            }
            const data = await handleServerResponse(response, set)
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ balance: data.balance, loading: false })
        } catch (error) {
            console.error('Ошибка при авторизации:', error)
            set({
                error: 'Ошибка при авторизации',
                loading: false,
            })
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ categories: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ formats: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    fetchVerifiedChannels: async (initDataRaw) => {
        set({ loading: true, error: null })
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ verifiedChannels: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ history: data, loading: false })
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set((state) => ({
                history: [...state.history, ...data],
                loading: false,
            }))
            return data
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    fetchSingleHistory: async (initDataRaw, order_id) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                `http://localhost:5000/history/${order_id}`,
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
                set({ singleHistory: [], loading: false })
                return []
            }
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ singleHistory: data, loading: false, error: null })
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            return data
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },
    deleteDateInCartItem: async (
        initDataRaw,
        publicationDate,
        cart_item_id
    ) => {
        try {
            const response = await fetch(
                'http://localhost:5000/cart/date-publication',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({
                        date: publicationDate,
                        cart_item_id: cart_item_id,
                    }),
                }
            )

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false, error: null })
            return data
        } catch (error) {
            set((state) => {
                console.log('Setting state:', {
                    error: error.message,
                    loading: false,
                })
                return { error: error.message, loading: false }
            })

            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)

            set({ orderInfo: data, loading: false, error: null }) // Обновляем статус
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    fetchUser: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    fetchMe: async (initDataRaw) => {
        set({ loading: true })

        try {
            const response = await fetch(`http://localhost:5000/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    fetchReviews: async (initDataRaw, id) => {
        set({ loading: true })

        try {
            const response = await fetch(
                `http://localhost:5000/users/reviews/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ reviews: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    confirmationOrder: async (initDataRaw, id) => {
        set({ loading: true })
        try {
            const response = await fetch(
                `http://localhost:5000/products/confirmation/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ user: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    topUpBalance: async (initDataRaw, amount, address, boc) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                'http://localhost:5000/balance/top-up',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({
                        tonAmount: amount,
                        UserAddress: address,
                        TransactionBoc: boc,
                    }),
                }
            )
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    handleWithdrawal: async (initDataRaw, amount, address) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                'http://localhost:5000/balance/withdraw',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({
                        amount: amount.toString(),
                        toAddress: address,
                    }),
                }
            )
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    handleReferral: async (initDataRaw) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch('http://localhost:5000/referral', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
            })
            // Проверяем, был ли запрос успешным
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ referral: data, loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    addReview: async (initDataRaw, order_id, rating, comment) => {
        set({ loading: true, error: null })
        try {
            const response = await fetch(
                'http://localhost:5000/orders/review',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({ order_id, rating, comment }),
                }
            )

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false, error: null })
            return data
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
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
    totalProducts: 1,
    filters: {
        category: '',
        priceRange: [0, 1000000000000000000],
        sort: 'desc',
    },
    formatNames: {
        1: '1/24',
        2: '2/48',
        3: '3/72',
        4: 'Indefinite',
        5: 'Repost',
        6: 'Response',
    },
    setPage: (newPage) => set({ page: newPage }),
    plusPage: () => set({ page: get().page + 1 }), // Увеличение страницы на 1
    minusPage: () => set({ page: get().page - 1 }),
    setProducts: (products) => ({ products }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
    fetchProducts: async (initDataRaw) => {
        set({ isLoading: true, error: null })
        const { searchQuery, filters, page } = get()

        const limit = 10
        const skip = (page - 1) * limit

        try {
            const queryParams = new URLSearchParams({
                q: searchQuery || '',
                category: filters.category || '',
                format: filters.format || '',
                minPrice: filters.priceRange
                    ? tonToNanoTon(filters.priceRange[0].toString())
                    : '',
                maxPrice: filters.priceRange
                    ? tonToNanoTon(filters.priceRange[1].toString())
                    : '',
                skip: skip.toString(),
                limit: limit.toString(),
                sort: filters.sort || '',
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
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)

            set({
                products: data.products,
                totalPages: data.totalPages || 1,
                totalProducts: data.totalProducts || 1,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ products: [], isLoading: false })
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ productDetails: data, loading: false })
        } catch (error) {
            console.error('Error fetching product details:', error)
            set({ error: error.message, loading: false })
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data // Вернем добавленный продукт
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error:', error)
            throw error
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

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)

            set({
                userProducts: data.products,
                totalPages: data.totalPages || 1,
                isLoading: false,
            })
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ userProducts: [], isLoading: false })
            throw error
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
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)

            set({
                myProducts: data,
                isLoading: false,
            })
            return data
        } catch (error) {
            console.error('Error fetching products:', error)
            set({ myProducts: [], isLoading: false })
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
            // Преобразование данных: извлекаем даты из каждого объекта
            const busyDaysArray = data.flatMap((item) => item.post_time) // Собираем все даты из массива post_time

            // console.log('Busy days:', busyDaysArray)

            set({ busyDay: busyDaysArray, loading: false })
        } catch (error) {
            console.error('Error fetching product details:', error)
            set({ error: error.message, loading: false })
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ categories: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ order_stats: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
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
                let errorMessage = 'Ошибка при добавлении в корзину'
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ответа:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ loading: false })
        } catch (error) {
            set({ loading: false, error: error })
            console.error('Error:', error)
            throw error
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
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }

            const data = await handleServerResponse(response, set)
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
                `http://localhost:5000/users/reviews/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )

            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ reviews: data, loading: false })
        } catch (error) {
            set({ loading: false })
            console.error('Error:', error)
            throw error
        }
    },
    pauseProduct: async (initDataRaw, id, status) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                `http://localhost:5000/products/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                    body: JSON.stringify({ id, status }), // Объект, а не строка
                }
            )
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set({ loading: false })
            return data
        } catch (error) {
            console.error('Ошибка при изменении статуса продукта:', error)
            set({
                error: 'Ошибка при изменении статуса продукта',
                loading: false,
            })
            throw error
        }
    },
    deleteProduct: async (initDataRaw, id) => {
        set({ loading: true, error: null })

        try {
            const response = await fetch(
                `http://localhost:5000/products/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `tma ${initDataRaw}`,
                    },
                }
            )
            if (!response.ok) {
                let errorMessage = `Ошибка сервера: ${response.status}`
                try {
                    const errorData = await response.json()
                    if (errorData?.error) {
                        errorMessage = errorData.error
                    }
                } catch (jsonError) {
                    console.warn('Ошибка при чтении тела ошибки:', jsonError)
                }

                throw new Error(errorMessage)
            }
            const data = await handleServerResponse(response, set)
            set((state) => ({
                products: state.products.filter(
                    (product) => product.product_id !== productID
                ),
                loading: false,
            }))
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error)
            set({ error: 'Ошибка при удалении продукта', loading: false })
            throw error
        }
    },
}))
