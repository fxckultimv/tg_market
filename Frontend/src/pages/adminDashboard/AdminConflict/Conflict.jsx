import React from 'react'
import { useEffect } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { useAdminStore } from '../../../store'
import { Link } from 'react-router-dom'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const Conflict = () => {
    const { conflictOrders, fetchConflictOrders, loading, error } =
        useAdminStore()
    useEffect(() => {
        fetchConflictOrders(initDataRaw())
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
        <div className="w-full max-w-7xl bg-medium-gray rounded-lg p-4 shadow-md min-h-screen">
            {/* Заголовки */}
            <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-white mb-2">
                <div>Название</div>
                <div>ID продукта</div>
                <div>ID покупателя</div>
                <div>ID продавца</div>
                <div>Цена</div>
                <div>Дата создания</div>
            </div>

            {/* Строки с продуктами */}
            {conflictOrders &&
                conflictOrders.map((order) => (
                    <Link
                        to={`/admin/conflict/${order.order_id}`}
                        key={order.order_id}
                    >
                        <div className="grid grid-cols-8 gap-4 p-4 bg-card-white border-[1px]">
                            <div className="font-bold">{order.title}</div>
                            <div>{order.order_id}</div>
                            <div>{order.user_id}</div>
                            <div>{order.seller_id}</div>
                            <div>{nanoTonToTon(order.total_price)} Ton.</div>
                            <div>{order.post_time}</div>
                            <div>
                                {new Date(
                                    order.created_at
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    )
}

export default Conflict
