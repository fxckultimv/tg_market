import React from 'react'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import Channel from './Channel'
import BackButton from '../../components/BackButton'
import { initDataRaw } from '@telegram-apps/sdk-react'

const MyChannels = () => {
    const { verifiedChannels, fetchVerifiedChannels, loading, error } =
        useUserStore()

    useEffect(() => {
        fetchVerifiedChannels(initDataRaw())
    }, [fetchVerifiedChannels])

    // useEffect(() => {
    //     const handleBackClick = () => {
    //         window.history.back()
    //     }

    //     if (backButton) {
    //         backButton.show()
    //         backButton.on('click', handleBackClick)

    //         return () => {
    //             backButton.hide()
    //             backButton.off('click', handleBackClick)
    //         }
    //     }
    // }, [backButton])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    if (!verifiedChannels || verifiedChannels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="text-xl text-text">Каналов пока нету</div>
                <p className="text-text m-2">Добавте свой канал через бота!</p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BackButton />
            {verifiedChannels.map((channel) => (
                <Channel channel={channel} />
            ))}
        </div>
    )
}

export default MyChannels
