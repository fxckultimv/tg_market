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
    const { cart, fetchCart, createOrder, deleteCartItem, loading, error } =
        useUserStore()
    const [selectedItems, setSelectedItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        fetchCart(initDataRaw)
    }, [initDataRaw, fetchCart])

    useEffect(() => {
        if (mainButton) {
            if (selectedItems.length > 0) {
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
                    // Создание заказа
                    const cartItemIds = selectedItems.map(
                        (item) => item.cart_item_id
                    )
                    await createOrder(initDataRaw, cartItemIds)

                    // Очистка состояния выбранных товаров
                    setSelectedItems([])

                    // Обновление корзины после создания заказа
                    await fetchCart(initDataRaw)

                    // Перенаправление на страницу "/basket"
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
        selectedItems,
        totalPrice,
        createOrder,
        initDataRaw,
        fetchCart,
        navigate,
    ])

    const handleSelectItem = (item) => {
        const isSelected = selectedItems.find(
            (selectedItem) => selectedItem.cart_item_id === item.cart_item_id
        )
        let updatedItems
        if (isSelected) {
            // Удаляем товар из выбранных
            updatedItems = selectedItems.filter(
                (selectedItem) =>
                    selectedItem.cart_item_id !== item.cart_item_id
            )
            setTotalPrice(totalPrice - item.price * item.quantity)
        } else {
            // Добавляем товар в выбранные
            updatedItems = [...selectedItems, item]
            setTotalPrice(totalPrice + item.price * item.quantity)
        }
        setSelectedItems(updatedItems)
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

    if (cart.length === 0) {
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
                {cart.map((item) => (
                    <CartItem
                        key={item.cart_item_id}
                        item={item}
                        onSelect={handleSelectItem}
                        isSelected={selectedItems.some(
                            (selectedItem) =>
                                selectedItem.cart_item_id === item.cart_item_id
                        )}
                    />
                ))}
            </ul>
        </div>
    )
}

export default Cart
