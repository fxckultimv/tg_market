import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLaunchParams } from '@tma.js/sdk-react'
import { useUserStore } from '../../store'
import { TonConnectButton } from '@tonconnect/ui-react'

const BuyOrder = () => {
    const { id } = useParams() // Получаем ID заказа из URL
    const { status, checkingStatus, buyProduct, loading, error } =
        useUserStore() // Получаем функции из состояния
    const { initDataRaw } = useLaunchParams() // Получаем параметры запуска
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)

    // При загрузке компонента проверяем статус заказа
    useEffect(() => {
        checkingStatus(initDataRaw, id)
    }, [initDataRaw, id, checkingStatus])

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
        return <div>Загрузка...</div>
    }

    if (error) {
        return <div>Ошибка: {error}</div>
    }

    // Если заказ уже оплачен, отображаем сообщение
    if (status === 'completed') {
        return (
            <div className="container mx-auto p-4">
                <div className="text-xl font-semibold text-green-600">
                    Заказ уже оплачен
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 flex-row ">
            <div>
                <TonConnectButton></TonConnectButton>
            </div>

            <h1 className="text-2xl font-bold mb-4">Заказ с ID: {id}</h1>
            <p className="mb-4">
                Для подтверждения покупки нажмите на кнопку ниже.
            </p>
            <button
                onClick={handleBuyProduct}
                className={`bg-accent-green bg-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 ${
                    isOrderProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isOrderProcessing}
            >
                {isOrderProcessing ? 'Обработка заказа...' : 'Купить'}
            </button>
        </div>
    )
}

export default BuyOrder
