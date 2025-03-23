import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import OrderSearch from './OrderSearch'
import OrderList from './OrderList'

const AdminOrders = () => {
    const { order, orders, fetchOrders, fetchOrdersForId, loading, error } =
        useAdminStore()

    const [currentPage, setCurrentPage] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const ordersPerPage = 10
    const [searchedOrder, setSearchedOrder] = useState(null)

    // Используем useEffect, чтобы делать запрос при изменении currentPage
    useEffect(() => {
        const skip = (currentPage - 1) * ordersPerPage
        fetchOrders(skip, ordersPerPage).then((data) => {
            if (data) {
                setTotalOrders(data.total) // Устанавливаем общее количество заказов
            }
        })
    }, [fetchOrders, currentPage])

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
            await fetchOrdersForId(orderId)
            setSearchedOrder(order) // сохраняем результат поиска
        },
        [fetchOrdersForId, order]
    )

    const fetchAllOrders = useCallback(() => {
        setSearchedOrder(null)
        fetchOrders()
    }, [fetchOrders])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl ">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center">
            <h2 className="mb-6 text-xl font-extrabold text-blue">
                Управление заказами
            </h2>

            <OrderSearch
                onSearch={handleSearch}
                fetchAllOrders={fetchAllOrders}
            />

            {searchedOrder && searchedOrder.order_id ? (
                <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                    <li
                        key={searchedOrder.order_id}
                        className="mb-4 p-4 rounded-lg bg-card-white shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-xl">
                            Заказ №{searchedOrder.order_id}
                        </div>
                        <div className="">
                            <span className="">ID пользователя:</span>{' '}
                            {searchedOrder.user_id}
                        </div>
                        <div className="">
                            <span className="">Сумма заказа:</span>{' '}
                            {searchedOrder.total_price} руб.
                        </div>
                        <div className="">
                            <span className="">Статус:</span>{' '}
                            {searchedOrder.status}
                        </div>
                        <div className="">
                            <span className="">Дата создания:</span>{' '}
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
