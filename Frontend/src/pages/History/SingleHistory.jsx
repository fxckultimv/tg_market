import React from 'react'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { useParams } from 'react-router-dom'
import StatusBar from './StatusBar'
import Loading from '../../Loading'
import Error from '../../Error'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'

const SingleHistory = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { order_id } = useParams()
    const { singleHistory, fetchSingleHistory, loading, error } = useUserStore()

    useEffect(() => {
        if (order_id) {
            fetchSingleHistory(initDataRaw, order_id)
        }
    }, [initDataRaw, order_id, fetchSingleHistory])

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
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    return (
        <>
            <div className="mb-6">
                <p className="text-3xl text-main-green mb-8 ">
                    История заказа: {order_id}
                </p>
            </div>

            <div className="flex justify-between mb-6">
                <p className="text-xl mb-2">{singleHistory.channel_title}</p>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px]"
                        src={`http://localhost:5000/channel_${singleHistory.channel_tg_id}.png`}
                        alt={singleHistory.channel_title}
                    />
                </div>
            </div>
            <StatusBar
                status={singleHistory.status}
                order_id={order_id}
                created_at={singleHistory.created_at}
                post_times={singleHistory.post_times || []}
            />

            {/* Данные о товаре */}
            <div className="mt-8 p-4 bg-card-white rounded-xl">
                <p>
                    <strong>Ссылка на канал:</strong>{' '}
                    <a
                        href={singleHistory.channel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue underline"
                    >
                        {singleHistory.channel_url}
                    </a>
                </p>
                <p>
                    <strong>Общая стоимость:</strong>{' '}
                    {nanoTonToTon(singleHistory.total_price)} ton.
                </p>
                <p>
                    <strong>Количество реклам:</strong>{' '}
                    {singleHistory.post_times?.length || 0}
                </p>
            </div>
            <div className="bg-card-white rounded-xl">
                {singleHistory.post_times &&
                    singleHistory.post_times.map((time, index) => (
                        <div key={index} className="mt-4 p-4 rounded-xl">
                            <p>
                                <strong>Дата и время поста:</strong>{' '}
                                {new Date(time).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            <p>
                                <strong>Цена:</strong>{' '}
                                {nanoTonToTon(singleHistory.price)} ton.
                            </p>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default SingleHistory
