import React from 'react'
import { useProductStore, useUserStore } from '../../store'
import { useEffect } from 'react'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'
import Channel from './Channel'

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

    if (!verifiedChannels) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {verifiedChannels.map((channel) => (
                <Link to={`${channel.channel_id}`} key={channel.channel_id}>
                    <Channel channel={channel} />
                </Link>
            ))}
        </div>
    )
}

export default MyChannels
