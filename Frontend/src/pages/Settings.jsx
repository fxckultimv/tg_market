import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../store'

const Setting = () => {
    const { isAdmin } = useAdminStore()

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white m-2">
            <h2 className="text-3xl font-bold mb-6">Настройки</h2>
            <Link
                to="/orders/pending"
                className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-purple-600 w-full"
            >
                Мои заказы (в ожидании)
            </Link>
            <Link
                to="/orders/paid"
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-green-600 w-full"
            >
                Мои заказы (оплаченные)
            </Link>
            <Link
                to="/orders/completed"
                className="bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-yellow-600 w-full"
            >
                Мои заказы (выполненные)
            </Link>
            <Link
                to="/history"
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-blue-600 w-full"
            >
                История
            </Link>
            <Link
                to="/channels"
                className="bg-indigo-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-600 w-full"
            >
                Мои каналы
            </Link>
            <Link
                to="/support"
                className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-red-600 w-full"
            >
                Поддержка
            </Link>
            {isAdmin && (
                <Link
                    to="/admin"
                    className="bg-gray-700 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-gray-600 w-full"
                >
                    Перейти в админ-панель
                </Link>
            )}{' '}
        </div>
    )
}

export default Setting
