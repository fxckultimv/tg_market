import React from 'react'
import { useParams } from 'react-router-dom'
import UserProducts from './UserProducts'
import UserReviews from './UserReviews'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { useEffect } from 'react'
import { useUserStore } from '../../store'
import { useState } from 'react'
import Error from '../../Error'
import Loading from '../../Loading'

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
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="min-h-screen bg-dark-gray min-w-screen">
            <div className="m-8">
                <div className="mb-2">
                    <img
                        className="rounded-full w-32 h-32 object-cover border-main-green border-2 "
                        src={`http://localhost:5000/user_${id}.png`}
                        alt={`${user.username}'s profile`}
                    />
                </div>
                <h1 className="text-xl font-bold  mb-4">{user.username}</h1>
                <div className="text-lg">
                    <p className="mb-2">⭐️Рейтинг: {user.rating}</p>
                    <p className="mb-2">
                        Дата создания аккаунта:{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
                {/* Buttons to toggle between products and reviews */}
                <div className="flex space-x-4">
                    <button
                        className={`px-4 py-2 font-bold rounded bg-card-white shadow-card ${
                            activeTab === 'products' ? 'text-blue' : ''
                        }`}
                        onClick={() => setActiveTab('products')}
                    >
                        Продукты
                    </button>
                    <button
                        className={`px-4 py-2 font-bold rounded bg-card-white shadow-card ${
                            activeTab === 'reviews' ? 'text-blue' : ''
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
