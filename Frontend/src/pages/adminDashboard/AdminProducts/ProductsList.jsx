import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../store'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const ProductsList = () => {
    const {
        products,
        fetchProducts,
        skip = 0,
        limit = 10,
        total = 0,
    } = useAdminStore()

    const handlePrev = () => {
        if (skip >= limit) {
            fetchProducts(initDataRaw(), null, skip - limit, limit)
        }
    }

    const handleNext = () => {
        if (skip + limit < total) {
            fetchProducts(initDataRaw(), null, skip + limit, limit)
        }
    }

    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500">Продуктов нету</div>
    }

    return (
        <>
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
                    <Link to={`${product.product_id}`} key={product.product_id}>
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

            <div className="flex justify-between items-center mt-4 text-white">
                <button
                    onClick={handlePrev}
                    disabled={skip === 0}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Назад
                </button>
                <div>
                    Страница {Math.floor(skip / limit) + 1} из{' '}
                    {Math.ceil(total / limit)}
                </div>
                <button
                    onClick={handleNext}
                    disabled={skip + limit >= total}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Вперёд
                </button>
            </div>
        </>
    )
}

export default ProductsList
