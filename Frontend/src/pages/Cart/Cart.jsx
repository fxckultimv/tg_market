import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import CartItem from './CartItem'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Delete from '../../assets/delete.svg'
import Loading from '../../Loading'

const Cart = () => {
    const { initDataRaw } = useLaunchParams()
    const mainButton = useMainButton()
    const navigate = useNavigate()
    const { cart, fetchCart, createOrder, deleteCartItem, loading, error } =
        useUserStore()
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        fetchCart(initDataRaw)
    }, [initDataRaw, fetchCart])

    useEffect(() => {
        if (mainButton) {
            if (selectedProductId) {
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
                    // Получаем все элементы корзины по выбранному product_id
                    const selectedItems = cart.products[selectedProductId].items

                    const cartItemIds = selectedItems.map(
                        (item) => item.cart_item_id
                    )
                    await createOrder(initDataRaw, cartItemIds)

                    setSelectedProductId(null)

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
        selectedProductId,
        totalPrice,
        createOrder,
        initDataRaw,
        fetchCart,
        navigate,
    ])

    const handleSelectProduct = (productId) => {
        let updatedTotalPrice = 0

        // Если товар уже выбран, снимаем выбор
        if (selectedProductId === productId) {
            setSelectedProductId(null)
        } else {
            // Устанавливаем выбранный товар и пересчитываем цену
            setSelectedProductId(productId)
            cart.products[productId].items.forEach((item) => {
                updatedTotalPrice +=
                    item.quantity * cart.products[productId].price
            })
        }

        setTotalPrice(updatedTotalPrice)
    }

    const handleDeleteItem = (productId) => {
        try {
            deleteCartItem(initDataRaw, productId)
            fetchCart(initDataRaw)
        } catch (err) {
            console.error('Ошибка при удалении:', err)
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    if (!cart || !cart.products || Object.keys(cart.products).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-2xl font-bold mb-4">
                    Ваша корзина пуста
                </div>

                <Link
                    to="/channels"
                    className="bg-accent-green text-white px-6 py-3 rounded-full font-semibold text-lg transition-transform transform hover:scale-105 hover:bg-green-600"
                >
                    Перейти к товарам
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-extrabold text-main-green mb-8">
                Корзина
            </h2>
            <ul className="space-y-6">
                {Object.entries(cart.products).map(([productId, product]) => (
                    <div
                        key={productId}
                        onClick={() => handleSelectProduct(productId)}
                        className={`bg-gradient-to-r from-dark-gray to-medium-gray p-2 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out ${
                            selectedProductId === productId
                                ? 'border-4 border-main-green scale-105'
                                : 'hover:shadow-2xl hover:scale-105'
                        }`}
                    >
                        <div className="flex-none">
                            <h3 className="text-xl font-extrabold mb-2 text-main-green">
                                {product.title}
                            </h3>{' '}
                            <p className="text-sm text-light-gray">
                                ⭐️ {product.rating}
                            </p>
                            {console.log(product.rating)}
                            <div className="">
                                <p>Время публикации: </p>
                                <div className="border flex justify-evenly border-main-gray rounded-lg p-3 bg-medium-gray gap-2">
                                    <ul className=" space-y-2">
                                        {product.items.map((item) => (
                                            <CartItem
                                                key={item.cart_item_id}
                                                item={item}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <p className="font-bold text-2xl text-accent-green">
                                {product.price}₽
                            </p>
                            <button onClick={() => handleDeleteItem(productId)}>
                                <img src={Delete} alt="" />
                            </button>
                        </div>

                        <div className="shrink">
                            <img
                                className="rounded-full object-cover border-2 border-accent-green shadow-lg"
                                src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                                alt={product.title}
                            />
                        </div>

                        {/* <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-extrabold mb-2 text-main-green">
                                {product.title}
                            </h3>
                        </div>

                        <div className="flex-shrink-0">
                            <img
                                className="rounded-full w-28 h-28 object-cover border-2 border-accent-green shadow-lg"
                                src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                                alt={product.title}
                            />
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-300">
                                Цена:{' '}
                                <span className="font-semibold text-main-green">
                                    {product.price} руб.
                                </span>
                            </p>
                            <p className="text-gray-300">
                                Общее количество:{' '}
                                <span className="font-semibold text-main-green">
                                    {product.items.reduce(
                                        (total, item) => total + item.quantity,
                                        0
                                    )}
                                </span>
                            </p>
                        </div>

                        <ul className="mt-4 space-y-2">
                            {product.items.map((item) => (
                                <CartItem key={item.cart_item_id} item={item} />
                            ))}
                        </ul> */}
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default Cart
