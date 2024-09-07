import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import CartItem from './CartItem'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Cart = () => {
    const { initDataRaw } = useLaunchParams()
    const mainButton = useMainButton()
    const navigate = useNavigate()
    const { cart, fetchCart, createOrder, loading, error } = useUserStore()
    const [selectedProductIds, setSelectedProductIds] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        fetchCart(initDataRaw)
    }, [initDataRaw, fetchCart])

    useEffect(() => {
        if (mainButton) {
            if (selectedProductIds.length > 0) {
                mainButton.setParams({
                    text: `Заказать ${totalPrice} руб.`,
                    isVisible: true,
                    isEnabled: true,
                    backgroundColor: '#22C55E',
                    textColor: '#ffffff',
                })
            } else {
                mainButton.setParams({
                    isVisible: false,
                    isEnabled: false,
                })
            }

            const handleMainButtonClick = async () => {
                try {
                    // Получаем все элементы корзины по выбранным product_id
                    const selectedItems = Object.entries(cart.products)
                        .filter(([productId]) =>
                            selectedProductIds.includes(productId)
                        )
                        .flatMap(([, product]) => product.items)

                    const cartItemIds = selectedItems.map(
                        (item) => item.cart_item_id
                    )
                    await createOrder(initDataRaw, cartItemIds)

                    setSelectedProductIds([])

                    await fetchCart(initDataRaw)

                    navigate('/basket')
                } catch (error) {
                    console.error('Ошибка при создании заказа:', error)
                }
            }

            mainButton.on('click', handleMainButtonClick)

            return () => {
                mainButton.off('click', handleMainButtonClick)
            }
        }
    }, [
        mainButton,
        selectedProductIds,
        totalPrice,
        createOrder,
        initDataRaw,
        fetchCart,
        navigate,
    ])

    const handleSelectProduct = (productId) => {
        const isSelected = selectedProductIds.includes(productId)
        let updatedProductIds
        let updatedTotalPrice = totalPrice

        if (isSelected) {
            // Убираем товар и его элементы из выбранных
            updatedProductIds = selectedProductIds.filter(
                (id) => id !== productId
            )
            // Уменьшаем итоговую цену
            cart.products[productId].items.forEach((item) => {
                updatedTotalPrice -=
                    item.quantity * cart.products[productId].price
            })
        } else {
            // Добавляем товар и его элементы в выбранные
            updatedProductIds = [...selectedProductIds, productId]
            // Увеличиваем итоговую цену
            cart.products[productId].items.forEach((item) => {
                updatedTotalPrice +=
                    item.quantity * cart.products[productId].price
            })
        }

        setSelectedProductIds(updatedProductIds)
        setTotalPrice(updatedTotalPrice)
    }

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

    if (!cart || !cart.products || Object.keys(cart.products).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-2xl font-bold mb-4">
                    Ваша корзина пуста
                </div>

                <Link
                    to="/channels"
                    className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-lg transition-transform transform hover:scale-105 hover:bg-green-600"
                >
                    Перейти к товарам
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold text-green-400 mb-6">
                Ваша корзина
            </h2>
            <ul className="space-y-4">
                {Object.entries(cart.products).map(([productId, product]) => (
                    <div
                        key={productId}
                        onClick={() => handleSelectProduct(productId)}
                        className={`bg-gray-800 rounded-lg p-4 shadow-md cursor-pointer transition duration-300 ${
                            selectedProductIds.includes(productId)
                                ? 'border-2 border-green-400'
                                : 'hover:shadow-lg'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-white">
                                {product.title}
                            </h3>
                            <p className="text-gray-400">
                                ID товара: {productId}
                            </p>
                        </div>
                        <p className="text-gray-400 mb-2">
                            {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-400">
                                Цена:{' '}
                                <span className="font-semibold">
                                    {product.price} руб.
                                </span>
                            </p>
                            <p className="text-gray-400">
                                Общее количество:{' '}
                                <span className="font-semibold">
                                    {product.items.reduce(
                                        (total, item) => total + item.quantity,
                                        0
                                    )}
                                </span>
                            </p>
                        </div>
                        <ul>
                            {product.items.map((item) => (
                                <CartItem key={item.cart_item_id} item={item} />
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default Cart
