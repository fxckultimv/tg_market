import { useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect } from 'react'
import { useProductStore } from '../../store'
import { useParams } from 'react-router-dom'

const UserReviews = () => {
    const { initDataRaw } = useLaunchParams()
    const { id } = useParams()
    const { reviews, fetchReviews, error, loading } = useProductStore()

    useEffect(() => {
        fetchReviews(initDataRaw, id)
    }, [fetchReviews, initDataRaw, id])

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

    return (
        <div className="min-h-screen bg-gray-900 text-white ">
            <h2 className="text-3xl font-bold mb-2 text-green-400">Отзывы</h2>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-gray-800 p-4 rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-base font-semibold text-green-400">
                                    Оценка: {review.rating}/5⭐️
                                </span>
                                <span className="text-sm text-gray-400">
                                    {new Date(
                                        review.created_at
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">Отзывов пока нет.</p>
            )}
        </div>
    )
}

export default UserReviews
