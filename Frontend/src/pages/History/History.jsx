import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import React from 'react'
import { useEffect } from 'react'
import { useUserStore } from '../../store'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Error from '../../Error'
import ProductCart from './ProductCart'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

const History = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
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
        fetchHistory(initDataRaw, searchParams.get('status'), limit, offset)
    }

    // Функция для подгрузки дополнительных данных
    const loadMoreHistory = () => {
        const newOffset = offset + limit
        appendHistory(initDataRaw, searchParams.get('status'), limit, newOffset)
        setOffset(newOffset)
        setCount(count + 1)
        console.log(count)
    }

    useEffect(() => {
        if (searchParams.get('status')) {
            loadInitialHistory()
        } else {
            fetchHistory(initDataRaw, null)
        }
    }, [initDataRaw, fetchHistory, searchParams])

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

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    if (!history) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-extrabold text-main-green mb-4">
                Заказы
            </h2>
            <div className="overflow-x-auto scroll-smooth whitespace-nowrap">
                <button
                    className=" px-2 m-2 bg-accent-green text-mg rounded-lg text-center whitespace-nowrap "
                    value="waiting"
                    onClick={handlerSubmit}
                >
                    ожидание
                </button>
                <button
                    className=" px-2 m-2 bg-accent-green text-mg rounded-lg text-center whitespace-nowrap"
                    value="completed"
                    onClick={handlerSubmit}
                >
                    в процессе
                </button>
                <button
                    className=" px-2 m-2 bg-accent-green text-mg rounded-lg text-center whitespace-nowrap"
                    value="completed"
                    onClick={handlerSubmit}
                >
                    выполненные
                </button>
                <button
                    className=" px-2 m-2 bg-accent-green text-mg rounded-lg text-center whitespace-nowrap"
                    value="awaiting payment"
                    onClick={handlerSubmit}
                >
                    ожидает оплаты
                </button>
                <button
                    className=" px-2 m-2 bg-accent-green text-mg rounded-lg text-center whitespace-nowrap"
                    value="rejected"
                    onClick={handlerSubmit}
                >
                    откланены
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {history.map((order) => (
                    <Link to={`${order.order_id}`} key={order.order_id}>
                        <ProductCart order={order} />
                    </Link>
                ))}
            </div>
            {history.length >= limit * count && (
                <div className="flex justify-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
