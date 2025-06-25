import React, { useState } from 'react'
import { useToast } from '../../components/ToastProvider'
import { useUserStore } from '../../store'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { useTranslation } from 'react-i18next'

const Feedback = ({ order_id }) => {
    const { addToast } = useToast()
    const { t } = useTranslation('History')
    const { addReview, fetchSingleHistory } = useUserStore()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault()
        addReview(initDataRaw(), order_id, rating, comment)

        setSubmitted(false)
        addToast(t('feedback.thanks'))
        fetchSingleHistory(initDataRaw(), order_id)
        setIsVisible(false)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    if (!isVisible) return null

    if (submitted) {
        return (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white shadow-lg rounded-xl text-center">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
                >
                    ✖
                </button>
                <p className="text-green-600 font-semibold">
                    {t('feedback.thanks')}
                </p>
            </div>
        )
    }

    return (
        <div className="fixed bottom-4 bg-card-white rounded-xl mx-4 p-2 mb-20 min-w-fit">
            <button
                onClick={handleClose}
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
            >
                ✖
            </button>
            <h3 className="text-xl font-semibold mb-2">
                {t('feedback.title')}
            </h3>
            <p className="mb-4">{t('feedback.leaveReview')}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Оценка */}
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={`cursor-pointer text-2xl ${
                                star <= rating ? 'text-yellow' : 'text-gray'
                            }`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Отзыв */}
                <textarea
                    className="bg-background p-2 border rounded-xl"
                    placeholder={t('feedback.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    maxLength={256}
                ></textarea>

                {/* Кнопка отправки */}
                <button
                    type="submit"
                    className="bg-green text-white py-2 rounded-md hover:bg-blue transition-colors"
                >
                    {t('feedback.button')}
                </button>
            </form>
        </div>
    )
}

export default Feedback
