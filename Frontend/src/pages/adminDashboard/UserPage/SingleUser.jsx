import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAdminStore } from '../../../store'
import UserProducts from './UserProducts'
import UserOrders from './UserOrders'
import UserCart from './UserCart'

const SingleUser = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { user, fetchUserForId, loading, error } = useAdminStore()
    const { id } = useParams()
    const [activeSection, setActiveSection] = useState('products')

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

    useEffect(() => {
        fetchUserForId(initDataRaw, id)
    }, [fetchUserForId, initDataRaw, id])

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'products':
                return <UserProducts user_id={user.user_id} />
            case 'orders':
                return <UserOrders user_id={user.user_id} />
            case 'cart':
                return <UserCart user_id={user.user_id} />
            default:
                return null
        }
    }

    return (
        <div>
            {user && (
                <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                    <li
                        key={user.user_id}
                        className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-xl font-bold">{user.username}</div>
                        <div className="text-gray-400">
                            <span className="font-semibold">ID:</span>{' '}
                            {user.user_id}
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">Рейтинг:</span>{' '}
                            {user.rating}
                        </div>
                        <div className="text-gray-400">
                            <span className="font-semibold">
                                Дата создания:
                            </span>{' '}
                            {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </li>
                </ul>
            )}

            <div className="flex space-x-4 mt-4">
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'products'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setActiveSection('products')}
                >
                    Продукты
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'orders'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setActiveSection('orders')}
                >
                    Заказы
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'cart'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setActiveSection('cart')}
                >
                    Корзина
                </button>
            </div>

            <div className="mt-4">{renderActiveSection()}</div>
        </div>
    )
}

export default SingleUser
