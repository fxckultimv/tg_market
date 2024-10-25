import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { useParams, Link, useNavigate } from 'react-router-dom'

const ProductDetails = () => {
    const { initDataRaw } = useLaunchParams()
    const { id } = useParams()
    const { product, fetchProductsForId, deleteProduct, loading, error } =
        useAdminStore()
    const backButton = useBackButton()
    const navigate = useNavigate()

    useEffect(() => {
        const handleBackClick = () => {
            window.history.back()
        }

        if (backButton) {
            backButton.show()
            backButton.on('click', handleBackClick)

            return () => {
                backButton.hide()
                backButton.off('click', handleBackClick)
            }
        }
    }, [backButton])

    useEffect(() => {
        fetchProductsForId(initDataRaw, id)
    }, [fetchProductsForId, initDataRaw, id])

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            'Вы уверены, что хотите удалить этот продукт?'
        )
        if (confirmDelete) {
            await deleteProduct(initDataRaw, product.product_id)
            navigate('/admin/products') // Перенаправление после удаления
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center bg-dark-gray text-white p-4 min-h-screen">
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-6 shadow-md">
                <li
                    key={product.product_id}
                    className="mb-4 p-4 rounded-lg bg-dark-gray text-white shadow transition duration-300 hover:shadow-lg"
                >
                    <div className="text-xl font-bold mb-2">
                        {product.title}
                    </div>
                    <div className="text-light-gray mb-2">
                        <span className="font-semibold">ID продукта:</span>{' '}
                        {product.product_id}
                    </div>
                    <div className="text-light-gray mb-2">
                        <span className="font-semibold">Категория:</span>{' '}
                        {product.category_id}
                    </div>
                    <div className="text-light-gray mb-2">
                        <span className="font-semibold">Описание:</span>{' '}
                        {product.description}
                    </div>
                    <div className="text-light-gray mb-2">
                        <span className="font-semibold">Цена:</span>{' '}
                        {product.price} руб.
                    </div>
                    <div className="text-light-gray mb-2">
                        <span className="font-semibold">Время публикации:</span>{' '}
                        {product.post_time}
                    </div>
                    <div className="text-light-gray mb-4">
                        <span className="font-semibold">Дата создания:</span>{' '}
                        {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-light-gray flex items-center mb-4">
                        <Link
                            to={`/admin/users/${product.user_id}`}
                            className="ml-4 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            <span className="font-semibold">
                                ID пользователя:
                            </span>{' '}
                            {product.user_id}
                        </Link>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="mt-4 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Удалить продукт
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default ProductDetails
