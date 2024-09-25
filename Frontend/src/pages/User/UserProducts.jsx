import { useLaunchParams } from '@tma.js/sdk-react'
import React from 'react'
import { useProductStore } from '../../store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const UserProducts = () => {
    const { initDataRaw } = useLaunchParams()
    const { id } = useParams()
    const {
        products,
        fetchUserProducts,
        page,
        totalPages,
        plusPage,
        minusPage,
        error,
        loading,
    } = useProductStore()

    useEffect(() => {
        fetchUserProducts(initDataRaw, id)
    }, [fetchUserProducts, initDataRaw])

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

    if (!products || products.length === 0) {
        return (
            <div className="text-white text-center mt-8">
                <p>Нет доступных продуктов</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <Link to={`${product.product_id}`} key={product.product_id}>
                    <div
                        key={product.product_id}
                        className="bg-gray-800 p-4 rounded-lg shadow-lg text-white flex justify-between items-center"
                    >
                        <div className="flex-1 mr-4">
                            <h3 className="text-xl font-bold mb-2">
                                {product.title}
                            </h3>
                            <p className="text-gray-400 mb-2">
                                {product.description}
                            </p>
                            <p>⭐️{product.rating}</p>
                            <p className="font-semibold text-green-400 mb-2">
                                Цена: {product.price} руб.
                            </p>
                            <p className="font-semibold text-green-400 mb-2">
                                Подписчики: {product.subscribers_count}
                            </p>
                            {/* <p className="text-gray-500 mb-2">
                        Дата публикации:{' '}
                        {new Date(
                            product.post_time
                        ).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                        Дата создания:{' '}
                        {new Date(
                            product.created_at
                        ).toLocaleDateString()}
                    </p> */}
                        </div>

                        <div className="flex-shrink-0">
                            <img
                                className="rounded-full w-32 h-32 object-cover border-green-400 border-2"
                                src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                                alt={product.title}
                            />
                        </div>
                    </div>
                </Link>
            ))}

            {/* Контролы пагинации в ChannelsList */}
            <div className="flex justify-between w-full mt-4">
                <button
                    onClick={minusPage}
                    className="px-3 py-2 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                    disabled={page === 1}
                >
                    Назад
                </button>
                <span>
                    Страница {page} из {totalPages}
                </span>
                <button
                    onClick={plusPage}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                >
                    Вперед
                </button>
            </div>
        </div>
    )
}

export default UserProducts
