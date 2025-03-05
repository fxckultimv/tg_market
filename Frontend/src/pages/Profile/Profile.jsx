import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore, useUserStore } from '../../store'
import {
    useInitDataRaw,
    useLaunchParams,
    useThemeParamsRaw,
} from '@tma.js/sdk-react'
import { useEffect } from 'react'
import Loading from '../../Loading'
import Error from '../../Error'
import ProfileLogo from '../../assets/profile-logo.svg'
import userLogo from '../../assets/profileLogo.png'

const Profile = () => {
    const { initDataRaw } = useLaunchParams()
    const { isAdmin } = useAdminStore()
    const theme = useThemeParamsRaw()
    const { user, fetchMe, fetchBalance, balance, error, loading, initData } =
        useUserStore()
    const user_id = initData.result.user.id

    useEffect(() => {
        fetchMe(initDataRaw)
        fetchBalance(initDataRaw)
    }, [initDataRaw, fetchMe])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3 m-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img
                        src={ProfileLogo}
                        alt="Документ"
                        className="h-[72px]"
                    />
                </div>
                <h1 className="text-black text-5xl">Объявления</h1>
            </div>
            <div className="flex gap-4">
                <div className="basis-1/3">
                    <div className="flex flex-col items-center justify-start min-h-screen bg-dark-gray  m-2">
                        <div className="flex  items-center mb-6">
                            <img
                                src={`http://localhost:5000/user_${user.user_uuid}.png`}
                                alt="User Profile"
                                className="rounded-full w-24 h-24 m-2"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = userLogo
                                }}
                            />
                            <p className="text-lg font-semibold">
                                Рейтинг: {user.rating}⭐️
                            </p>
                        </div>
                        <p className=" border-2 border-green-400 rounded-xl p-4 m-2 text-xl">
                            Баланс: {balance} RUB
                        </p>
                        <Link
                            to="/history"
                            className="bg-medium-gray px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
                        >
                            Мои заказы
                        </Link>
                        <Link
                            to="/products"
                            className="bg-medium-gray  px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
                        >
                            Мои продукты
                        </Link>
                        <Link
                            to="/my_channels"
                            className="bg-medium-gray  px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
                        >
                            Мои каналы
                        </Link>
                        <a
                            className="bg-medium-gray  px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-medium-gray w-full"
                            href="https://t.me/Stepanusik"
                        >
                            Поддержка
                        </a>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="bg-gray-700  px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-main-gray w-full"
                            >
                                Перейти в админ-панель
                            </Link>
                        )}{' '}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
