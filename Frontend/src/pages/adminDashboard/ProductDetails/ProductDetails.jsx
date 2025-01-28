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
            <div className="flex items-center justify-center min-h-screen bg-dark-gray ">
                <div className="text-xl ">Загрузка...</div>
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
        <div className="flex flex-col items-center bg-dark-gray  p-4 min-h-screen">
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-6 shadow-md">
                <li
                    key={product.product_id}
                    className="mb-4 p-4 rounded-lg bg-dark-gray  shadow transition duration-300 hover:shadow-lg"
                >
                    <div className="text-xl font-bold mb-2">
                        {product.title}
                    </div>
                    <div className=" mb-2">
                        <span className="">ID продукта:</span>{' '}
                        {product.product_id}
                    </div>
                    <div className=" mb-2">
                        <span className="">Категория:</span>{' '}
                        {product.category_id}
                    </div>
                    <div className=" mb-2">
                        <span className="">Описание:</span>{' '}
                        {product.description}
                    </div>
                    <div className=" mb-2">
                        <span className="">Цена:</span> {product.price} руб.
                    </div>
                    <div className=" mb-2">
                        <span className="">Время публикации:</span>{' '}
                        {product.post_time}
                    </div>
                    <div className=" mb-4">
                        <span className="">Дата создания:</span>{' '}
                        {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className=" flex items-center mb-4">
                        <Link
                            to={`/admin/users/${product.user_id}`}
                            className="ml-4 px-3 py-1 rounded bg-blue-500  hover:bg-blue-600"
                        >
                            <span className="">ID пользователя:</span>{' '}
                            {product.user_id}
                        </Link>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="mt-4 px-4 py-2 rounded bg-red-600  hover:bg-red-700"
                    >
                        Удалить продукт
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default ProductDetails
