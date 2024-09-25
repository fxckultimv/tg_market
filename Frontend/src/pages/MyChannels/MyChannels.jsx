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
                        className="bg-gray-800 p-4 rounded-lg shadow-lg text-white flex justify-between items-center"
                    >
                        <div className="flex-1 mr-4">
                            <h3 className="text-xl font-bold mb-2">
                                {channel.channel_name}
                            </h3>
                            <p className="text-gray-400 mb-2">
                                {channel.channel_url}
                            </p>
                            {/* <p>⭐️{channel.rating}</p> */}
                            <p className="font-semibold text-green-400 mb-2">
                                Подписчики: {channel.subscribers_count}
                            </p>
                            {/* <p className="text-gray-500 mb-2">
                            Дата публикации:{' '}
                            {new Date(
                                product.post_time
                            ).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500">
                            Дата создания:{' '}
                            {new Date(
                                product.created_at
                            ).toLocaleDateString()}
                        </p> */}
                        </div>

                        <div className="flex-shrink-0">
                            <img
                                className="rounded-full w-32 h-32 object-cover border-green-400 border-2"
                                src={`http://localhost:5000/channel_${channel.channel_tg_id}.png`}
                                alt={channel.channel_name}
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default MyChannels
