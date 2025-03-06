import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { useUserStore } from '../../store'
import { nanoTonToTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import Loading from '../../Loading'
import Error from '../../Error'
import { useToast } from '../../components/ToastProvider'
import duckMoney from '../../assets/duckMoney.webp'

const BuyOrder = () => {
    const { id } = useParams() // Получаем ID заказа из URL
    const {
        orderInfo,
        balance,
        fetchBalance,
        checkingStatus,
        buyProduct,
        loading,
        error,
    } = useUserStore() // Получаем функции из состояния
    const { initDataRaw } = useLaunchParams() // Получаем параметры запуска
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)
    const { addToast } = useToast()
    const backButton = useBackButton()

    // При загрузке компонента проверяем статус заказа
    useEffect(() => {
        checkingStatus(initDataRaw, id)
        fetchBalance(initDataRaw)
    }, [initDataRaw])

    useEffect(() => {
        const handleBackClick = () => {
            window.history.back()
        }

        if (backButton) {
            backButton.show()
            backButton.on('click', handleBackClick)

            return () => {
                backButton.hide()
                backButton.off('click', handleBackClick)
            }
        }
    }, [backButton])

    const handleBuyProduct = async () => {
        setIsOrderProcessing(true)
        try {
            const result = await buyProduct(initDataRaw, id)
            if (!result) {
                throw new Error('Покупка не удалась, сервер вернул null')
            }
            // После успешной покупки обновляем статус заказа
            await checkingStatus(initDataRaw, id)
            addToast('Успешно куплено!')
        } catch (err) {
            console.error('Ошибка при покупке:', err)
            addToast('Ошибка при покупке, попробуйте снова.', 'error')
        } finally {
            setIsOrderProcessing(false)
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    // Если заказ уже оплачен, отображаем сообщение
    if (['completed', 'paid'].includes(orderInfo.status)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <img src={duckMoney} alt="" className="px-10" />
                <div className="text-xl font-semibold pt-4">Заказ оплачен</div>
            </div>
        )
    }

    const isBalanceSufficient =
        nanoTonToTon(balance) >= nanoTonToTon(orderInfo.total_price)

    return (
        <div className="text-text container mx-auto p-4 flex-row min-h-screen">
            {/* <h1 className="text-2xl font-bold mb-4">Заказ с ID: {id}</h1> */}
            <div className="flex justify-between">
                <div className="">
                    <p className="text-2xl">{orderInfo.title}</p>
                    <a
                        href={orderInfo.channel_url}
                        className="text-blue hover:"
                    >
                        канал
                    </a>
                </div>

                <img
                    src={`http://localhost:5000/channel_${orderInfo.channel_tg_id}.png`}
                    alt={orderInfo.title}
                    className="rounded-full max-h-[111px] max-w-[111px]"
                />
            </div>
            <p className="text-base p-2">Формат: {orderInfo.format_name}</p>
            <div className="bg-card-white rounded-xl p-2">
                <strong>Дата и время поста:</strong>
                {orderInfo.post_times && orderInfo.post_times.length > 0 ? (
                    orderInfo.post_times.map((time, index) => (
                        <div key={index} className="mt-4 rounded-xl">
                            <p>
                                {new Date(time).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">
                        Нет информации о времени поста
                    </p>
                )}
            </div>

            <p className="py-2">Ваш баланс: {nanoTonToTon(balance)} TON</p>
            <p className="py-2">
                Стоимость заказа: {nanoTonToTon(orderInfo.total_price)} TON
            </p>
            <button
                onClick={handleBuyProduct}
                className={`bg-blue px-6 py-3 rounded-2xl font-semibold transition-transform transform${
                    isOrderProcessing || !isBalanceSufficient
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                }`}
                disabled={isOrderProcessing || !isBalanceSufficient}
            >
                {isOrderProcessing ? 'Обработка заказа...' : 'Купить'}
            </button>
            {!isBalanceSufficient && (
                <p className="text-red-500 mt-2">
                    Недостаточно средств для покупки.
                </p>
            )}
        </div>
    )
}

export default BuyOrder
