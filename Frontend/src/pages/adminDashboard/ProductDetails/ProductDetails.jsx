import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { initDataRaw } from '@telegram-apps/sdk-react'
import DefaultImage from '../../../assets/defaultImage.png'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const ProductDetails = () => {
    const { id } = useParams()
    const { product, fetchProductsForId, deleteProduct, loading, error } =
        useAdminStore()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProductsForId(initDataRaw(), id)
    }, [fetchProductsForId, id])

    const handlePause = async () => {
        try {
        } catch (err) {}
    }

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            'Вы уверены, что хотите удалить этот продукт?'
        )
        if (confirmDelete) {
            await deleteProduct(initDataRaw(), product.product_id)
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
        <div className="flex flex-col items-center p-4 min-h-screen">
            <ul className="bg-card-white rounded-lg p-2">
                <li
                    key={product.product_id}
                    className="mb-4 p-4 rounded-lg bg-dark-gray  shadow transition duration-300 hover:shadow-lg"
                >
                    <img
                        className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                        src={
                            `http://localhost:5000/channel_${product.channel_tg_id}.png` ||
                            DefaultImage
                        }
                        alt={product.channel_name}
                        onError={(e) => {
                            e.currentTarget.src = DefaultImage
                        }}
                    />
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
                        <span className="">Цена:</span>{' '}
                        {nanoTonToTon(product.price)} Ton.
                    </div>
                    <div className=" mb-2">
                        <span className="">Время публикации:</span>{' '}
                        {product.post_time}
                    </div>
                    <div className=" mb-4">
                        <span className="">Дата создания:</span>{' '}
                        {new Date(product.created_at).toLocaleDateString()}
                    </div>
                    <div className="bg-background flex items-center mb-4">
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
