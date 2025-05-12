import React from 'react'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import StatusBar from './StatusBar'
import Loading from '../../Loading'
import Error from '../../Error'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import BackButton from '../../components/BackButton'
import { initDataRaw } from '@telegram-apps/sdk-react'
import Feedback from './Feedback'
import DefaultImage from '../../assets/defaultImage.png'
import EquivalentCourse from '../../components/EquivalentCourse'

const SingleHistory = () => {
    const { order_id } = useParams()
    const { singleHistory, fetchSingleHistory, loading, error } = useUserStore()

    useEffect(() => {
        if (order_id) {
            fetchSingleHistory(initDataRaw(), order_id)
        }
    }, [order_id, fetchSingleHistory])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    return (
        <>
            <BackButton />
            <div className="flex justify-between my-6">
                <p className="text-xl mb-2">{singleHistory.channel_title}</p>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px]"
                        src={
                            `http://localhost:5000/channel_${singleHistory.channel_tg_id}.png` ||
                            DefaultImage
                        }
                        alt={singleHistory.channel_title}
                        onError={(e) => {
                            e.currentTarget.src = DefaultImage
                        }}
                    />
                </div>
            </div>
            <StatusBar
                status={singleHistory.status}
                order_id={order_id}
                created_at={singleHistory.created_at}
                post_times={singleHistory.post_times || []}
            />
            {singleHistory.status === 'problem' && (
                <div className="p-2 mt-2 items-center text-center bg-red rounded-xl">
                    <p className="text-xl text-white">Спорт открыт</p>
                </div>
            )}

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
                    {nanoTonToTon(singleHistory.total_price)} ton.{' '}
                    <EquivalentCourse
                        ton={nanoTonToTon(singleHistory.total_price)}
                    />
                </p>
                {singleHistory.discounted_price && (
                    <p className="">
                        <strong>Цена со скидкой:</strong>{' '}
                        {nanoTonToTon(singleHistory.discounted_price)} ton.{' '}
                        <EquivalentCourse
                            ton={nanoTonToTon(singleHistory.discounted_price)}
                        />
                    </p>
                )}
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
            {singleHistory.status === 'completed' &&
                !singleHistory.review_id && <Feedback order_id={order_id} />}
        </>
    )
}

export default SingleHistory
