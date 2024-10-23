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
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-dark-gray text-white ">
            <h2 className="text-3xl font-bold mb-2 text-main-green">Отзывы</h2>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-medium-gray p-4 rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-base font-semibold text-main-green">
                                    Оценка: {review.rating}/5⭐️
                                </span>
                                <span className="text-sm text-light-gray">
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
                <p className="text-light-gray">Отзывов пока нет.</p>
            )}
        </div>
    )
}

export default UserReviews
