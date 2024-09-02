import React from 'react'
import { useAdminStore } from '../../../store'
import { useEffect } from 'react'
import { useLaunchParams } from '@tma.js/sdk-react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const UserProducts = () => {
    const { initDataRaw } = useLaunchParams()
    const { products, fetchProductsForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    useEffect(() => {
        fetchProductsForUser(initDataRaw, id)
    }, [initDataRaw, id])

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
                Управление продуктами
            </h2>
            <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                {products.map((product) => (
                    <Link
                        to={`/admin/products/${product.product_id}`}
                        key={product.product_id}
                    >
                        <li
                            key={product.product_id}
                            className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                {product.title}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID продукта:
                                </span>{' '}
                                {product.product_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    ID пользователя:
                                </span>{' '}
                                {product.user_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Категория:
                                </span>{' '}
                                {product.category_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Описание:</span>{' '}
                                {product.description}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Цена:</span>{' '}
                                {product.price} руб.
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Время публикации:
                                </span>{' '}
                                {product.post_time}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Дата создания:
                                </span>{' '}
                                {new Date(
                                    product.created_at
                                ).toLocaleDateString()}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default UserProducts
