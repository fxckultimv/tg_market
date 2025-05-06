import React, { useEffect } from 'react'
import { useAdminStore } from '../../../store'
import { useParams } from 'react-router-dom'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'

const UserCart = () => {
    const { carts, fetchCartForUser, loading, error } = useAdminStore()
    const { id } = useParams()

    useEffect(() => {
        fetchCartForUser(initDataRaw(), id)
    }, [])

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
            <div className=" bg-card-white p-4">
                {/* Заголовки */}
                <div className="grid grid-cols-8 gap-4 text-sm font-semibold text-white mb-2">
                    <div>Название</div>
                    <div>ID продукта</div>
                    <div>ID корзины</div>
                    <div>Категория</div>
                    <div>Описание</div>
                    <div>Цена</div>
                    <div>Количество</div>
                    <div>Дата добавления</div>
                </div>

                {/* Строки корзины */}
                {carts &&
                    carts.map((cart) => (
                        <div
                            key={cart.cart_item_id}
                            className="grid grid-cols-8 gap-4 p-4 bg-card-white border-[1px] m-2"
                        >
                            <div className="font-bold">{cart.title}</div>
                            <div>{cart.product_id}</div>
                            <div>{cart.cart_id}</div>
                            <div>{cart.category_id}</div>
                            <div className="truncate">{cart.description}</div>
                            <div>{nanoTonToTon(cart.price)} Ton.</div>
                            <div>{cart.quantity}</div>
                            <div>
                                {new Date(cart.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default UserCart
