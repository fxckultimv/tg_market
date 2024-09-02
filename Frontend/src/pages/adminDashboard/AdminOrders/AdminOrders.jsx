import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import OrderSearch from './OrderSearch'
import OrderList from './OrderList'

const AdminOrders = () => {
    const { order, orders, fetchOrders, fetchOrdersForId, loading, error } =
        useAdminStore()
    const { initDataRaw } = useLaunchParams()

    console.log(order)

    const [currentPage, setCurrentPage] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const ordersPerPage = 10
    const [searchedOrder, setSearchedOrder] = useState(null)

    // Используем useEffect, чтобы делать запрос при изменении currentPage
    useEffect(() => {
        const skip = (currentPage - 1) * ordersPerPage
        fetchOrders(initDataRaw, skip, ordersPerPage).then((data) => {
            if (data) {
                setTotalOrders(data.total) // Устанавливаем общее количество заказов
            }
        })
    }, [fetchOrders, initDataRaw, currentPage])

    const totalPages = Math.ceil(totalOrders / ordersPerPage)

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleSearch = useCallback(
        async (orderId) => {
            await fetchOrdersForId(initDataRaw, orderId)
            setSearchedOrder(order) // сохраняем результат поиска
        },
        [fetchOrdersForId, initDataRaw, order]
    )

    const fetchAllOrders = useCallback(() => {
        setSearchedOrder(null)
        fetchOrders(initDataRaw)
    }, [fetchOrders, initDataRaw])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-1">
            <h2 className="mb-6 text-xl font-extrabold text-green-400">
                Управление заказами
            </h2>

            <OrderSearch
                onSearch={handleSearch}
                fetchAllOrders={fetchAllOrders}
            />

            {searchedOrder && searchedOrder.order_id ? (
                <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                    <li
                        key={searchedOrder.order_id}
                        className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-xl font-bold">
                            Заказ №{searchedOrder.order_id}
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">
                                ID пользователя:
                            </span>{' '}
                            {searchedOrder.user_id}
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">Сумма заказа:</span>{' '}
                            {searchedOrder.total_price} руб.
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">Статус:</span>{' '}
                            {searchedOrder.status}
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">
                                Дата создания:
                            </span>{' '}
                            {new Date(
                                searchedOrder.created_at
                            ).toLocaleDateString()}
                        </div>
                    </li>
                </ul>
            ) : (
                <OrderList
                    orders={orders}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    )
}

export default AdminOrders
