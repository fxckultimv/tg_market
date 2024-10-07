import React from 'react'
import { useProductStore, useUserStore } from '../../store'
import { useEffect } from 'react'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'

const MyChannels = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { verifiedChannels, fetchVerifiedChannels, loading, error } =
        useUserStore()

    useEffect(() => {
        fetchVerifiedChannels(initDataRaw)
    }, [initDataRaw, fetchVerifiedChannels])

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

    if (!verifiedChannels) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {verifiedChannels.map((channel) => (
                <Link to={`${channel.channel_id}`} key={channel.channel_id}>
                    <div
                        key={channel.channel_id}
                        className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out"
                    >
                        <div className="flex-1">
                            <h3 className="text-xl font-extrabold mb-2 text-green-400">
                                {channel.channel_name}
                            </h3>
                            <div className="mb-2">
                                <div className="border border-gray-600 rounded-lg p-3 bg-gray-800">
                                    <p className="text-sm text-gray-300">
                                        Подписчики:{' '}
                                        <span className="text-green-400">
                                            {channel.subscribers_count}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Просмотров:{' '}
                                        <span className="text-green-400">
                                            {Math.round(channel.views)}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        ER:{' '}
                                        <span className="text-green-400">
                                            {(
                                                (100 /
                                                    channel.subscribers_count) *
                                                channel.views
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <img
                                className="rounded-full w-28 h-28 object-cover border-2 border-green-500 shadow-lg"
                                src={`http://localhost:5000/channel_${channel.channel_tg_id}.png`}
                                alt={channel.title}
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default MyChannels
