import React from 'react'
import DatePublication from './DatePublication'
import { useState } from 'react'
import Delete from '../../assets/delete.svg'
import { useEffect } from 'react'
import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import { useProductStore, useUserStore } from '../../store'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/ToastProvider'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'

const CartItem = ({ cart }) => {
    const { initDataRaw } = useLaunchParams()
    const navigate = useNavigate()
    const mainButton = useMainButton()
    const { fetchCart, createOrder, deleteCartItem, loading, error } =
        useUserStore()
    const { formatNames } = useProductStore()
    const [selectedProductId, setSelectedProductId] = useState(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const { addToast } = useToast()

    useEffect(() => {
        if (window.innerWidth <= 768) {
            if (mainButton) {
                if (selectedProductId) {
                    mainButton.setParams({
                        text: `Заказать ${totalPrice} Ton.`,
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
                        const selectedItems =
                            cart.products[selectedProductId].items

                        const cartItemIds = selectedItems.map(
                            (item) => item.cart_item_id
                        )
                        await createOrder(initDataRaw, cartItemIds)

                        setSelectedProductId(null)

                        await fetchCart(initDataRaw)
                        addToast('Товар заказан!')
                        // navigate('/basket')
                    } catch (error) {
                        addToast('Ошибка при создании заказа!', 'error')
                        console.error('Ошибка при создании заказа:', error)
                    }
                }

                mainButton.on('click', handleMainButtonClick)

                return () => {
                    mainButton.off('click', handleMainButtonClick)
                }
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

    const handleButtonClick = async () => {
        try {
            // Проверяем, выбран ли товар
            if (selectedProductId === null) {
                console.log('Нет выбранных товаров.')
                return
            }

            // Получаем все элементы корзины по выбранному product_id
            const selectedItems = cart.products[selectedProductId].items
            // Извлекаем id товаров в корзине
            const cartItemIds = selectedItems.map((item) => item.cart_item_id)
            // Создаем заказ
            await createOrder(initDataRaw, cartItemIds)
            // Сбрасываем выбранный товар после создания заказа
            setSelectedProductId(null)
            // Обновляем корзину
            await fetchCart(initDataRaw)
            addToast('Товар заказан!')
            mainButton.hide()

            // Перенаправляем пользователя на страницу корзины
            // navigate('/basket')
        } catch (err) {
            addToast('Ошибка при создании заказа!', 'error')
            console.log('Ошибка при создании заказа:', error)
        }
    }

    const handleSelectProduct = (productId) => {
        let updatedTotalPrice = 0

        const now = new Date()

        // Проверяем наличие устаревших публикаций
        const hasExpiredItems = cart.products[productId].items.some((item) => {
            const postTime = new Date(item.post_time)
            return postTime < now // Если время публикации меньше текущего, элемент устарел
        })

        if (hasExpiredItems) {
            addToast('Удалите устаревшее время!', 'warning')
            return // Прерываем выполнение функции
        }

        // Если товар уже выбран, снимаем выбор
        if (selectedProductId === productId) {
            setSelectedProductId(null)
        } else {
            // Устанавливаем выбранный товар и пересчитываем цену
            setSelectedProductId(productId)
            cart.products[productId].items.forEach((item) => {
                updatedTotalPrice += cart.products[productId].price
            })
        }

        setTotalPrice(nanoTonToTon(updatedTotalPrice))
    }

    const handleDeleteItem = (productId) => {
        try {
            deleteCartItem(initDataRaw, productId.slice(0, -2))
            fetchCart(initDataRaw)
            addToast('Товар удалён!')
        } catch (err) {
            console.error('Ошибка при удалении:', err)
        }
    }

    return (
        <>
            <div className="mr-auto basis-2/3">
                <ul className="space-y-6">
                    {Object.entries(cart.products).map(
                        ([productId, product]) => (
                            <div
                                key={productId}
                                onClick={() => handleSelectProduct(productId)}
                                className={`bg-card-white p-4 rounded-xl  flex flex-col gap-2 transform transition duration-300 ease-in-out ${
                                    selectedProductId === productId
                                        ? 'border-blue border-2'
                                        : 'hover:shadow-2xl'
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
                                    <div className="flex gap-5">
                                        <div className="flex flex-col justify-between text-center items-start">
                                            <p className="text-xl">
                                                {product.title}
                                            </p>
                                            <p className="text-base">
                                                ⭐️ {product.rating}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-base px-4 py-1 border-[1px] border-gray rounded-full">
                                                {product.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray w-full h-[1px]"></div>
                                <div className="flex justify-between max-md:flex-col">
                                    {' '}
                                    <p className="">
                                        Формат: {formatNames[product.format_id]}
                                    </p>
                                    <p className="">
                                        Время:{' '}
                                        {new Date(
                                            product.items[0].post_time
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gray w-full h-[1px]"></div>
                                <div className="flex-none">
                                    <div className="">
                                        <p>Даты публикации: </p>
                                        <div>
                                            <ul className="flex gap-3 justify-start flex-wrap items-center">
                                                {product.items.map((item) => (
                                                    <DatePublication
                                                        key={item.cart_item_id}
                                                        item={item}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray w-full h-[1px] "></div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                        <img
                                            src={Ton}
                                            alt=""
                                            className="h-[2em]"
                                        />
                                        <p className=" text-lg text-accent-green">
                                            {nanoTonToTon(product.price)} Ton
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleDeleteItem(productId)
                                        }
                                        className=""
                                    >
                                        <img
                                            src={Delete}
                                            alt=""
                                            className="bg-red p-3 rounded-md duration-300 hover:scale-105"
                                        />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </ul>
            </div>
            <div className="basis-1/3 max-md:hidden">
                <div className="bg-dark-blue text-white p-6 rounded-xl mx-auto basis-1/3 w-full">
                    <h2 className="text-lg  mb-4">Оформление заказа</h2>
                    <div className="space-y-2">
                        {selectedProductId !== null && (
                            // Отображаем выбранный товар и его цену
                            <div
                                className="flex justify-between"
                                key={selectedProductId}
                            >
                                <p>
                                    {cart.products[selectedProductId].title} (3
                                    дня)
                                </p>
                                <p>
                                    {cart.products[
                                        selectedProductId
                                    ].items.reduce(
                                        (total, item) =>
                                            total +
                                            item.quantity *
                                                nanoTonToTon(
                                                    cart.products[
                                                        selectedProductId
                                                    ].price
                                                ),
                                        0
                                    )}{' '}
                                    Ton
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-gray my-4"></div>
                    <div className="flex justify-between text-lg ">
                        <p>Итого:</p>
                        <p>{totalPrice} Ton</p>
                    </div>
                    <button
                        className="w-full bg-white py-2 mt-4 rounded-lg  hover:bg-blue transition duration-300"
                        onClick={() => handleButtonClick()}
                    >
                        <p className="text-black hover:text-white duration-300">
                            Заказать
                        </p>
                    </button>
                </div>
            </div>
        </>
    )
}

export default CartItem
