import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'

const OrderDetails = () => {
    const { id } = useParams()
    const { orderDetails, fetchOrdersDetails, loading, error } = useAdminStore()
    const [hasFetched, setHasFetched] = useState(false)

    useEffect(() => {
        if (!hasFetched) {
            fetchOrdersDetails(initDataRaw(), id)
        }
    }, [fetchOrdersDetails, hasFetched, id])

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
                Детали заказа #{id}
            </h2>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {orderDetails.map((item) => (
                    <li
                        key={item.order_item_id}
                        className="mb-4 p-4 rounded-lg bg-dark-gray  shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-lg font-bold">
                            Позиция заказа #{item.order_item_id}
                        </div>
                        <div className="">
                            <span className="font-semibold">ID продукта:</span>{' '}
                            {item.product_id}
                        </div>
                        <div className="">
                            <span className="font-semibold">Количество:</span>{' '}
                            {item.quantity}
                        </div>
                        <div className="">
                            <span className="font-semibold">Цена:</span>{' '}
                            {item.price} руб.
                        </div>
                        <div className="">
                            <span className="font-semibold">
                                Время публикации:
                            </span>{' '}
                            {item.post_time}
                        </div>
                        <div className="">
                            <span className="font-semibold">
                                Дата создания:
                            </span>{' '}
                            {new Date(item.created_at).toLocaleDateString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrderDetails
