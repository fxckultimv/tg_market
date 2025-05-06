import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../store'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const OrderList = () => {
    const {
        orders,
        fetchOrders,
        skip = 0,
        limit = 10,
        total = 0,
    } = useAdminStore()

    const handlePrev = () => {
        if (skip >= limit) {
            fetchOrders(initDataRaw(), null, skip - limit, limit)
        }
    }

    const handleNext = () => {
        if (skip + limit < total) {
            fetchOrders(initDataRaw(), null, skip + limit, limit)
        }
    }
    if (!orders || orders.length === 0) {
        return <div className="text-center text-gray-500">Заказов нету</div>
    }
    return (
        <>
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
                    <Link to={`${order.order_id}`} key={order.order_id}>
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

            <div className="flex justify-between items-center mt-4 text-white">
                <button
                    onClick={handlePrev}
                    disabled={skip === 0}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Назад
                </button>
                <div>
                    Страница {Math.floor(skip / limit) + 1} из{' '}
                    {Math.ceil(total / limit)}
                </div>
                <button
                    onClick={handleNext}
                    disabled={skip + limit >= total}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Вперёд
                </button>
            </div>
        </>
    )
}

export default OrderList
