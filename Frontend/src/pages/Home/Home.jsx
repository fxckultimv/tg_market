import { useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect } from 'react'
import { useUserStore } from '../../store'

const Home = () => {
    const { initDataRaw } = useLaunchParams()
    const { fetchAuth, loading, error } = useUserStore()

    useEffect(() => {
        fetchAuth(initDataRaw)
    }, [initDataRaw, fetchAuth])

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

    // Фейковая статистика
    const fakeStats = {
        totalChannels: 15000,
        totalAdvertisers: 3200,
        adsPlaced: 67000,
        revenueGenerated: 1000000,
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <main className="flex flex-1 flex-col items-center justify-center text-center">
                <h2 className="mt-4 text-5xl font-extrabold text-green-400 shadow-lg pb-4">
                    TeleAdMarket
                </h2>
                <p className="mb-8 text-xl text-gray-400">
                    Наше приложение помогает вам безопасно покупать рекламу в
                    Telegram-каналах и автоматизировать процесс ее продажи.
                    Станьте продавцом рекламы в несколько кликов!
                </p>
                <button className="rounded-full bg-green-500 px-6 py-2 font-bold text-white shadow-xl transition duration-300 hover:bg-green-600">
                    Начать сейчас
                </button>
            </main>

            <section
                id="features"
                className="w-full bg-gray-800 py-16 text-gray-300"
            >
                <div className="container mx-auto px-6 text-center">
                    <h3 className="mb-8 text-3xl font-bold text-green-500">
                        Особенности
                    </h3>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="rounded-lg bg-gray-900 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Простота использования
                            </h4>
                            <p>
                                Простой и интуитивно понятный интерфейс для
                                управления вашей рекламой.
                            </p>
                        </div>
                        <div className="rounded-lg bg-gray-900 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Широкий охват
                            </h4>
                            <p>
                                Доступ к обширной сети каналов и групп в
                                Telegram.
                            </p>
                        </div>
                        <div className="rounded-lg bg-gray-900 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Автоматизация
                            </h4>
                            <p>
                                Автоматизируйте размещение рекламы и управляйте
                                кампаниями без лишних усилий.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Фейковая статистика */}
            <section
                id="stats"
                className="w-full bg-gray-900 py-16 text-gray-300"
            >
                <div className="container mx-auto px-6 text-center">
                    <h3 className="mb-8 text-3xl font-bold text-green-500">
                        Наша статистика
                    </h3>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="rounded-lg bg-gray-800 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Каналы
                            </h4>
                            <p className="text-xl font-semibold">
                                {fakeStats.totalChannels.toLocaleString()}
                            </p>
                            <p>каналов подключено</p>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Рекламодатели
                            </h4>
                            <p className="text-xl font-semibold">
                                {fakeStats.totalAdvertisers.toLocaleString()}
                            </p>
                            <p>рекламодателей</p>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Размещено рекламы
                            </h4>
                            <p className="text-xl font-semibold">
                                {fakeStats.adsPlaced.toLocaleString()}
                            </p>
                            <p>объявлений размещено</p>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-6 shadow-md transition duration-300 hover:shadow-xl">
                            <h4 className="mb-2 text-2xl font-bold text-green-400">
                                Генерированная выручка
                            </h4>
                            <p className="text-xl font-semibold">
                                ${fakeStats.revenueGenerated.toLocaleString()}
                            </p>
                            <p>заработано</p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="pricing"
                className="w-full bg-gray-700 py-16 text-gray-300"
            ></section>
        </div>
    )
}

export default Home
