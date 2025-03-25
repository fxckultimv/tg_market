import React from 'react'
import { useEffect } from 'react'
import { useUserStore } from '../../store'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Error from '../../Error'
import ProductCart from './ProductCart'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import BackButton from '../../components/BackButton'
import { initDataRaw } from '@telegram-apps/sdk-react'

const History = () => {
    const { history, fetchHistory, appendHistory, loading, error } =
        useUserStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const [offset, setOffset] = useState(0)
    const [count, setCount] = useState(1)

    const limit = 20

    const handlerSubmit = (e) => {
        const buttonValue = e.target.value
        const currentStatus = searchParams.get('status')

        if (currentStatus === buttonValue) {
            setSearchParams({})
        } else {
            setSearchParams({ status: buttonValue })
        }
    }

    // Функция для первой загрузки данных
    const loadInitialHistory = () => {
        fetchHistory(initDataRaw(), searchParams.get('status'), limit, offset)
    }

    // Функция для подгрузки дополнительных данных
    const loadMoreHistory = () => {
        const newOffset = offset + limit
        appendHistory(
            initDataRaw(),
            searchParams.get('status'),
            limit,
            newOffset
        )
        setOffset(newOffset)
        setCount(count + 1)
        console.log(count)
    }

    useEffect(() => {
        if (searchParams.get('status')) {
            loadInitialHistory()
        } else {
            fetchHistory(initDataRaw(), null)
        }
    }, [fetchHistory, searchParams])

    // useEffect(() => {
    //     const handleBackClick = () => {
    //         window.history.back()
    //     }

    //     if (backButton) {
    //         backButton.show()
    //         backButton.on('click', handleBackClick)

    //         return () => {
    //             backButton.hide()
    //             backButton.off('click', handleBackClick)
    //         }
    //     }
    // }, [backButton])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    if (!history) {
        return (
            <div className="bg-dark-gray flex min-h-screen items-center justify-center bg">
                <div className="text-red-500 text-xl">Заказов ещё нет!</div>
            </div>
        )
    }

    return (
        <div className="basis-2/3">
            <BackButton />
            <div className="flex items-center justify-start gap-2 flex-wrap">
                <button
                    className={`rounded-md p-2 hover:text-gray border-gray border-[1px] max-sm:px-1 ${searchParams.get('status') === 'waiting' ? 'bg-blue' : 'bg-card-white hover:text-gray'}`}
                    value="waiting"
                    onClick={handlerSubmit}
                >
                    ожидание
                </button>
                <button
                    className={`rounded-md p-2 hover:text-gray border-gray border-[1px] max-sm:px-1 ${searchParams.get('status') === 'paid' ? 'bg-blue' : 'bg-card-white hover:text-gray'}`}
                    value="paid"
                    onClick={handlerSubmit}
                >
                    в процессе
                </button>
                <button
                    className={`rounded-md p-2 hover:text-gray border-gray border-[1px] max-sm:px-1 ${searchParams.get('status') === 'completed' ? 'bg-blue' : 'bg-card-white hover:text-gray'}`}
                    value="completed"
                    onClick={handlerSubmit}
                >
                    выполненные
                </button>
                <button
                    className={`rounded-md p-2 hover:text-gray border-gray border-[1px] max-sm:px-1 ${searchParams.get('status') === 'pending_payment' ? 'bg-blue' : 'bg-card-white hover:text-gray'}`}
                    value="pending_payment"
                    onClick={handlerSubmit}
                >
                    ожидает оплаты
                </button>
                <button
                    className={`rounded-md p-2 border-gray border-[1px] max-sm:px-1 ${searchParams.get('status') === 'rejected' ? 'bg-blue' : 'bg-card-white hover:text-gray'}`}
                    value="rejected"
                    onClick={handlerSubmit}
                >
                    отклонены
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-3">
                {history.map((order) => (
                    <Link to={`history/${order.order_id}`} key={order.order_id}>
                        <ProductCart order={order} />
                    </Link>
                ))}
            </div>
            {history.length >= limit * count && (
                <div className="flex justify-center mt-4">
                    <button
                        className="rounded-lg bg-blue px-4 py-2 bg"
                        onClick={loadMoreHistory}
                    >
                        Загрузить ещё
                    </button>
                </div>
            )}
        </div>
    )
}

export default History
