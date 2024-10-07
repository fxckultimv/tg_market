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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
            {products.map((product) => (
                <Link
                    to={`/channels/${product.product_id}`}
                    key={product.product_id}
                >
                    <div
                        key={product.product_id}
                        className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out"
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-extrabold mb-2 text-green-400">
                                {product.title}
                            </h3>
                            <div className="mb-2">
                                <p className="text-sm text-gray-400">
                                    ⭐️ {product.rating}
                                </p>
                                <div className="border border-gray-600 rounded-lg p-3 bg-gray-800">
                                    <p className="text-sm text-gray-300">
                                        Подписчики:{' '}
                                        <span className="text-green-400">
                                            {product.subscribers_count}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Просмотров:{' '}
                                        <span className="text-green-400">
                                            {Math.round(product.views)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        ER:{' '}
                                        <span className="text-green-400">
                                            {(
                                                (100 /
                                                    product.subscribers_count) *
                                                product.views
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        CPV:{' '}
                                        <span className="text-green-400">
                                            {Math.round(
                                                product.price / product.views
                                            )}{' '}
                                            р
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <p className="font-bold text-2xl text-green-500">
                                {product.price}₽
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <img
                                className="rounded-full w-28 h-28 object-cover border-2 border-green-500 shadow-lg"
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
