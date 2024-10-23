import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore, useUserStore } from '../../store'
import { useInitDataRaw, useLaunchParams } from '@tma.js/sdk-react'
import { useEffect } from 'react'
import Loading from '../../Loading'
import Error from '../../Error'

const Profile = () => {
    const { initDataRaw } = useLaunchParams()
    const { isAdmin } = useAdminStore()
    const initData = useInitDataRaw()
    const { user, fetchMe, error, loading } = useUserStore()
    const user_id = initData.result.user.id
    console.log(user_id)

    useEffect(() => {
        fetchMe(initDataRaw)
    }, [initDataRaw, fetchMe])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-dark-gray text-white m-2">
            <div className="flex  items-center mb-6">
                <img
                    src={`http://localhost:5000/user_${user.user_uuid}.png`}
                    alt="User Profile"
                    className="rounded-full w-24 h-24 m-2"
                />
                <p className="text-lg font-semibold">Рейтинг: 4.8⭐️</p>
            </div>
            <Link
                to="/history"
                className="bg-medium-gray text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
            >
                Мои заказы
            </Link>
            <Link
                to="/products"
                className="bg-medium-gray text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
            >
                Мои продукты
            </Link>
            <Link
                to="/my_channels"
                className="bg-medium-gray text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
            >
                Мои каналы
            </Link>
            <a
                className="bg-medium-gray text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
                href="https://t.me/Stepanusik"
            >
                Поддержка
            </a>
            {isAdmin && (
                <Link
                    to="/admin"
                    className="bg-gray-700 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-main-gray w-full"
                >
                    Перейти в админ-панель
                </Link>
            )}{' '}
        </div>
    )
}

export default Profile
