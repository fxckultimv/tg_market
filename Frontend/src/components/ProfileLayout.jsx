import React from 'react'
import { useAdminStore, useUserStore } from '../store'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useInitDataRaw, useLaunchParams } from '@tma.js/sdk-react'
import ProfileCustomLink from '../components/ProfileCustomLink'
import ProfileLogo from '../assets/profile-logo.svg'
import StarFull from '../assets/star-full.svg'
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
    useTonWallet,
} from '@tonconnect/ui-react'

const ProfileLayout = () => {
    const { isAdmin } = useAdminStore()
    const { initDataRaw } = useLaunchParams()
    const { user, fetchMe, fetchBalance, balance, error, loading } =
        useUserStore()

    useEffect(() => {
        fetchMe(initDataRaw)
        fetchBalance(initDataRaw)
    }, [initDataRaw, fetchMe])

    //Ton Connect UI

    const userFriendlyAddress = useTonAddress()
    const rawAddress = useTonAddress(false)

    const wallet = useTonWallet()

    const [tonConnectUI, setOptions] = useTonConnectUI()

    // Функция для смены языка интерфейса
    const onLanguageChange = (lang) => {
        setOptions({ language: lang })
    }

    // Объект с данными для транзакции
    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // Срок действия - 60 сек
        messages: [
            {
                address: '0QDHqPLXVrZvdbH-RzSgLFgPokwqLLU78Jbsq8pgPV3LOZdY', // адрес получателя
                amount: '50000000', // сумма в нанотонах (например, 0.02 TON)
                // опционально: stateInit, payload и другие параметры
            },
        ],
    }

    return (
        <>
            {' '}
            <div className="flex flex-col items-center justify-center gap-3 m-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img
                        src={ProfileLogo}
                        alt="Документ"
                        className="h-[32px]"
                    />
                </div>
                <h1 className="text-black text-5xl text-center max-md:text-3xl">
                    Личный кабинет
                </h1>
            </div>
            <div className="flex gap-4 p-16 max-md:p-5 max-xl:p-8 max-md:flex-col">
                <div className="basis-1/3">
                    <div className="flex flex-col  bg-card-white rounded-t-xl">
                        <div>
                            <div className="flex gap-3 max-lg:flex-col">
                                <img
                                    src={`http://localhost:5000/user_${user.user_uuid}.png`}
                                    alt="User Profile"
                                    className="rounded-full w-24 h-24 m-2"
                                />
                                <div>
                                    <p>Pop478</p>
                                    <div className="flex gap-2 items-center">
                                        <p className="text-lg font-semibold">
                                            4.8
                                        </p>
                                        <img src={StarFull} alt="" />
                                    </div>
                                    <p className=" border-2 border-green rounded-md p-2 text-base">
                                        Баланс: {balance} RUB
                                    </p>
                                </div>
                            </div>
                            <TonConnectButton></TonConnectButton>
                            {rawAddress && (
                                <div>
                                    <span>
                                        User-friendly address:{' '}
                                        {userFriendlyAddress}
                                    </span>
                                    <span>Raw address: {rawAddress}</span>
                                </div>
                            )}
                            {wallet && (
                                <div>
                                    <span>Connected wallet:{wallet.name}</span>
                                    <span>Device: {wallet.device.appName}</span>
                                </div>
                            )}
                            <div>
                                {/* Кнопка для отправки транзакции */}
                                <button
                                    onClick={() =>
                                        tonConnectUI.sendTransaction(
                                            myTransaction
                                        )
                                    }
                                >
                                    Send transaction
                                </button>

                                {/* Интерфейс для выбора языка */}
                                <div>
                                    <label>Language:</label>
                                    <select
                                        onChange={(e) =>
                                            onLanguageChange(e.target.value)
                                        }
                                    >
                                        <option value="en">English</option>
                                        <option value="ru">Русский</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start bg-card-white rounded-b-xl">
                        <ProfileCustomLink to="/profile">
                            Мои заказы
                        </ProfileCustomLink>
                        <ProfileCustomLink to="/profile/products">
                            Мои продукты
                        </ProfileCustomLink>
                        <ProfileCustomLink to="/profile/my_channels">
                            Мои каналы
                        </ProfileCustomLink>
                        <a
                            href="https://t.me/Stepanusik"
                            className="p-3 rounded-lg hover:text-gray"
                        >
                            Поддержка
                        </a>
                        {isAdmin && (
                            <ProfileCustomLink to="/admin">
                                Перейти в админ-панель
                            </ProfileCustomLink>
                        )}{' '}
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default ProfileLayout
