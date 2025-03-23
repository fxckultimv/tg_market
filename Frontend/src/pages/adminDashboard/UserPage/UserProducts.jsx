import React from 'react'
import { useAdminStore } from '../../../store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const UserProducts = () => {
    const { products, fetchProductsForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    useEffect(() => {
        fetchProductsForUser(id)
    }, [id])

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
        <div className="flex min-h-screen flex-col items-center bg-dark-gray bg-card-white p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление продуктами
            </h2>
            <ul className="w-full max-w-4xl bg-card-white rounded-lg p-2 shadow-md">
                {products.map((product) => (
                    <Link
                        to={`/admin/products/${product.product_id}`}
                        key={product.product_id}
                    >
                        <li
                            key={product.product_id}
                            className="mb-4 p-4 rounded-lg bg-dark-gray bg-card-white shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                {product.title}
                            </div>
                            <div className="">
                                <span className="">ID продукта:</span>{' '}
                                {product.product_id}
                            </div>
                            <div className="">
                                <span className="">ID пользователя:</span>{' '}
                                {product.user_id}
                            </div>
                            <div className="">
                                <span className="">Категория:</span>{' '}
                                {product.category_id}
                            </div>
                            <div className="">
                                <span className="">Описание:</span>{' '}
                                {product.description}
                            </div>
                            <div className="">
                                <span className="">Цена:</span> {product.price}{' '}
                                руб.
                            </div>
                            <div className="">
                                <span className="">Время публикации:</span>{' '}
                                {product.post_time}
                            </div>
                            <div className="">
                                <span className="">Дата создания:</span>{' '}
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
