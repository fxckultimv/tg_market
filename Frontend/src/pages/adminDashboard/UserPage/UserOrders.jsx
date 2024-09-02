import { useLaunchParams } from '@tma.js/sdk-react'
import React from 'react'
import { useAdminStore } from '../../../store'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const UserOrders = () => {
    const { initDataRaw } = useLaunchParams()
    const { orders, fetchOrdersForUser, loading, error } = useAdminStore()
    const { id } = useParams()
    const [hasFetched, setHasFetched] = useState(false)

    console.log(id)

    useEffect(() => {
        if (!hasFetched) {
            fetchOrdersForUser(initDataRaw, id).then(() => {
                setHasFetched(true)
            })
        }
    }, [initDataRaw, fetchOrdersForUser, orders])

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
            <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                {orders.map((order) => (
                    <Link
                        key={order.user_id}
                        to={`/admin/orders/${order.order_id}`}
                    >
                        <li
                            key={order.order_id}
                            className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                Заказ #{order.order_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID заказа:
                                </span>{' '}
                                {order.order_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID пользователя:
                                </span>{' '}
                                {order.user_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Статус:</span>{' '}
                                {order.status}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Общая сумма:
                                </span>{' '}
                                {order.total_price} руб.
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Дата создания:
                                </span>{' '}
                                {new Date(
                                    order.created_at
                                ).toLocaleDateString()}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default UserOrders
