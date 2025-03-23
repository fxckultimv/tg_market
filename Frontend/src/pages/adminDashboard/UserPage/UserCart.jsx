import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useParams } from 'react-router-dom'

const UserCart = () => {
    const { carts, fetchCartForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    useEffect(() => {
        fetchCartForUser(id)
    }, [fetchCartForUser])

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
        <div className="flex min-h-screen flex-col items-center bg-dark-gray bg-background p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление корзиной
            </h2>
            <ul className="w-full max-w-4xl bg-card-white rounded-lg p-2 shadow-md">
                {carts &&
                    carts.map((cart) => (
                        <li
                            key={cart.cart_item_id}
                            className="mb-4 p-4 rounded-lg bg-dark-gray bg-card-white shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                {cart.title}
                            </div>
                            <div className="">
                                <span className="">ID продукта:</span>{' '}
                                {cart.product_id}
                            </div>
                            <div className="">
                                <span className="">ID корзины:</span>{' '}
                                {cart.cart_id}
                            </div>
                            <div className="">
                                <span className="">Категория:</span>{' '}
                                {cart.category_id}
                            </div>
                            <div className="">
                                <span className="">Описание:</span>{' '}
                                {cart.description}
                            </div>
                            <div className="">
                                <span className="">Цена:</span> {cart.price}{' '}
                                руб.
                            </div>
                            <div className="">
                                <span className="">Количество:</span>{' '}
                                {cart.quantity}
                            </div>
                            <div className="">
                                <span className="">Время публикации:</span>{' '}
                                {new Date(cart.post_time).toLocaleDateString()}
                            </div>
                            <div className="">
                                <span className="">
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
