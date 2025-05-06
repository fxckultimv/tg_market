import React from 'react'
import { useAdminStore } from '../../../store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const UserProducts = () => {
    const { products, fetchProductsForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    useEffect(() => {
        fetchProductsForUser(initDataRaw(), id)
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
        <div className="flex min-h-screen flex-col items-center bg-dark-gray bg-card-white">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление продуктами пользователя
            </h2>
            <div className="w-full max-w-7xl bg-medium-gray rounded-lg p-4 shadow-md">
                {/* Заголовки */}
                <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-white mb-2">
                    <div>Название</div>
                    <div>ID продукта</div>
                    <div>ID пользователя</div>
                    <div>Категория</div>
                    <div>Описание</div>
                    <div>Цена</div>
                    <div>Время публикации</div>
                    <div>Дата создания</div>
                </div>

                {/* Строки с продуктами */}
                {products.map((product) => (
                    <Link
                        to={`/admin/products/${product.product_id}`}
                        key={product.product_id}
                    >
                        <div className="grid grid-cols-8 gap-4 p-4 bg-card-white border-[1px]">
                            <div className="font-bold">{product.title}</div>
                            <div>{product.product_id}</div>
                            <div>{product.user_id}</div>
                            <div>{product.category_id}</div>
                            <div className="truncate">
                                {product.description}
                            </div>
                            <div>{nanoTonToTon(product.price)} Ton.</div>
                            <div>{product.post_time}</div>
                            <div>
                                {new Date(
                                    product.created_at
                                ).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default UserProducts
