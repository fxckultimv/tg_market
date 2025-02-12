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
        <div className="container mx-auto p-4 flex-row min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Заказ с ID: {id}</h1>
            <p className="py-3">Ваш баланс: {nanoTonToTon(balance)} TON</p>
            <p className="py-3">
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
