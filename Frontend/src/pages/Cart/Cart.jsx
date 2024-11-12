import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import CartItem from './CartItem'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Delete from '../../assets/delete.svg'
import Loading from '../../Loading'
import Bag from '../../assets/bag.svg'

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-2xl font-bold mb-4">
                    Ваша корзина пуста
                </div>

                <Link
                    to="/channels"
                    className="bg-accent-green bg-white px-6 py-3 rounded-full font-semibold text-lg transition-transform transform hover:scale-105 hover:bg-green-600"
                >
                    Перейти к товарам
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3 m-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img src={Bag} alt="Документ" className="h-[32px]" />
                </div>
                <div className="flex">
                    <h1 className="text-black text-5xl max-md:text-3xl">
                        Корзина
                    </h1>
                    <p>{Object.keys(cart.products).length}</p>
                </div>
            </div>
            <div className="flex justify-between p-16 max-md:p-5 max-xl:p-8 max-md:flex-col">
                <div className="mr-auto basis-2/3">
                    <ul className="space-y-6">
                        {Object.entries(cart.products).map(
                            ([productId, product]) => (
                                <div
                                    key={productId}
                                    onClick={() =>
                                        handleSelectProduct(productId)
                                    }
                                    className={`bg-card-white px-6 py-5 rounded-xl   flex flex-col gap-3 transform hover:scale-105 transition duration-300 ease-in-out ${
                                        selectedProductId === productId
                                            ? 'border-4 border-main-green scale-105'
                                            : 'hover:shadow-2xl hover:scale-105'
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="aspect-square">
                                            <img
                                                className="rounded-full max-h-[111px]"
                                                src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                                                alt={product.title}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl mb-2 text-main-green">
                                                {product.title}
                                            </h3>{' '}
                                            <p className="text-base">
                                                ⭐️ {product.rating}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray w-full h-[1px]"></div>
                                    <div className="flex-none">
                                        <div className="">
                                            <p>Время публикации: </p>
                                            <div>
                                                <ul className="flex gap-3 justify-start flex-wrap items-center">
                                                    {product.items.map(
                                                        (item) => (
                                                            <CartItem
                                                                key={
                                                                    item.cart_item_id
                                                                }
                                                                item={item}
                                                            />
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray w-full h-[1px] "></div>
                                    <div className="flex justify-between items-center">
                                        <p className=" text-2xl text-accent-green">
                                            {product.price}₽
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleDeleteItem(productId)
                                            }
                                            className="p-3"
                                        >
                                            <img
                                                src={Delete}
                                                alt=""
                                                className="bg-red p-3 rounded-md"
                                            />
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </ul>
                </div>
                <div className="basis-1/3">
                    <div className="bg-dark-blue text-white p-6 rounded-xl mx-auto basis-1/3 w-full">
                        <h2 className="text-lg  mb-4">Оформление заказа</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <p>Топор+ (3 дня)</p>
                                <p>1500 ₽</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Топор+ (3 дня)</p>
                                <p>1500 ₽</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Топор+ (3 дня)</p>
                                <p>1500 ₽</p>
                            </div>
                        </div>
                        <div className="border-t border-gray my-4"></div>
                        <div className="flex justify-between text-lg ">
                            <p>Итого:</p>
                            <p>4500 ₽</p>
                        </div>
                        <button className="w-full bg-blue-500 bg-white py-2 mt-4 rounded-lg  hover:bg-blue-600 transition">
                            Перейти к оплате
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
