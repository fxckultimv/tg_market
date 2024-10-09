import React from 'react'
import { useParams } from 'react-router-dom'
import UserProducts from './UserProducts'
import UserReviews from './UserReviews'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { useEffect } from 'react'
import { useUserStore } from '../../store'
import { useState } from 'react'

const User = () => {
    const { id } = useParams()
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { user, fetchUser, error, loading } = useUserStore()
    const [activeTab, setActiveTab] = useState('products')

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
        fetchUser(initDataRaw, id)
    }, [initDataRaw])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-2 py-4">
                <div className="mb-2">
                    <img
                        className="rounded-full w-32 h-32 object-cover border-green-400 border-2"
                        src={`http://localhost:5000/user_${id}.png`}
                        alt={`${user.username}'s profile`}
                    />
                </div>
                <h1 className="text-xl font-bold text-green-400 mb-4">
                    {user.username}
                </h1>
                <div className="text-lg text-gray-400">
                    <p className="mb-2">⭐️Рейтинг: {user.rating}</p>
                    <p className="mb-2">
                        Дата создания аккаунта:{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
                {/* Buttons to toggle between products and reviews */}
                <div className="mt-8 flex space-x-4">
                    <button
                        className={`px-4 py-2 font-bold rounded ${
                            activeTab === 'products'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                        }`}
                        onClick={() => setActiveTab('products')}
                    >
                        Продукты
                    </button>
                    <button
                        className={`px-4 py-2 font-bold rounded ${
                            activeTab === 'reviews'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Отзывы
                    </button>
                </div>

                {/* Display content based on the active tab */}
                <div className="mt-4">
                    {activeTab === 'products' ? (
                        <UserProducts />
                    ) : (
                        <UserReviews />
                    )}
                </div>
            </div>
        </div>
    )
}

export default User
