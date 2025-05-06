import React from 'react'
import { useAdminStore } from '../../../store'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const UserOrders = () => {
    const { orders, fetchOrdersForUser, loading, error } = useAdminStore()
    const { id } = useParams()
    const [hasFetched, setHasFetched] = useState(false)

    useEffect(() => {
        fetchOrdersForUser(initDataRaw(), id)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray ">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray ">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-dark-gray  p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление заказами пользователя
            </h2>
            <div className="w-full max-w-7xl bg-medium-gray rounded-lg p-4 shadow-md">
                {/* Заголовки */}
                <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-white mb-2">
                    <div>ID заказа</div>
                    <div>ID пользователя</div>
                    <div>Сумма</div>
                    <div>Статус</div>
                    <div>Дата создания</div>
                </div>

                {/* Строки заказов */}
                {orders.map((order) => (
                    <Link
                        to={`/admin/orders/${order.order_id}`}
                        key={order.order_id}
                    >
                        <div className="grid grid-cols-5 gap-4 p-4 bg-card-white border-[1px]">
                            <div className="font-bold">№{order.order_id}</div>
                            <div>{order.user_id}</div>
                            <div>{nanoTonToTon(order.total_price)} Ton.</div>
                            <div>{order.status}</div>
                            <div>
                                {new Date(
                                    order.created_at
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default UserOrders
