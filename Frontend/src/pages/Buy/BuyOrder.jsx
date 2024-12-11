import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLaunchParams } from '@tma.js/sdk-react'
import { useUserStore } from '../../store'
import { nanoTonToTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import Loading from '../../Loading'
import Error from '../../Error'

const BuyOrder = () => {
    const { id } = useParams() // Получаем ID заказа из URL
    const { orderInfo, balance, checkingStatus, buyProduct, loading, error } =
        useUserStore() // Получаем функции из состояния
    const { initDataRaw } = useLaunchParams() // Получаем параметры запуска
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)

    // При загрузке компонента проверяем статус заказа
    useEffect(() => {
        checkingStatus(initDataRaw, id)
    }, [initDataRaw])

    const handleBuyProduct = async () => {
        setIsOrderProcessing(true)
        try {
            await buyProduct(initDataRaw, id)
            // После успешной покупки, обновляем статус заказа
            await checkingStatus(initDataRaw, id)
        } catch (err) {
            console.error('Ошибка при покупке:', err)
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
    if (orderInfo.status === 'completed') {
        return (
            <div className="container mx-auto p-4">
                <div className="text-xl font-semibold text-green-600">
                    Заказ уже оплачен
                </div>
            </div>
        )
    }

    const isBalanceSufficient =
        nanoTonToTon(balance) >= nanoTonToTon(orderInfo.total_price)

    return (
        <div className="container mx-auto p-4 flex-row ">
            <h1 className="text-2xl font-bold mb-4">Заказ с ID: {id}</h1>
            <p className="mb-4">
                Для подтверждения покупки нажмите на кнопку ниже.
            </p>
            <p>Ваш баланс: {nanoTonToTon(balance)} TON</p>
            <p>Стоимость заказа: {nanoTonToTon(orderInfo.total_price)} TON</p>
            <button
                onClick={handleBuyProduct}
                className={`bg-accent-green bg-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 ${
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
