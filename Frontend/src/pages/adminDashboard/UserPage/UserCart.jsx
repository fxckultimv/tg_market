import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import { useParams } from 'react-router-dom'

const UserCart = () => {
    const { initDataRaw } = useLaunchParams()
    const { carts, fetchCartForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    console.log(carts)

    useEffect(() => {
        fetchCartForUser(initDataRaw, id)
    }, [fetchCartForUser, initDataRaw])

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
                Управление корзиной
            </h2>
            <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                {carts &&
                    carts.map((cart) => (
                        <li
                            key={cart.cart_item_id}
                            className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                {cart.title}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID продукта:
                                </span>{' '}
                                {cart.product_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID корзины:
                                </span>{' '}
                                {cart.cart_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Категория:
                                </span>{' '}
                                {cart.category_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Описание:</span>{' '}
                                {cart.description}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Цена:</span>{' '}
                                {cart.price} руб.
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Количество:
                                </span>{' '}
                                {cart.quantity}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Время публикации:
                                </span>{' '}
                                {new Date(cart.post_time).toLocaleDateString()}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Дата добавления в корзину:
                                </span>{' '}
                                {new Date(cart.created_at).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default UserCart
