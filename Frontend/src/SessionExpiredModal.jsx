import React from 'react'

const SessionExpiredModal = () => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-black">
                <h2 className="text-2xl text-center mb-4">Сессия истекла</h2>
                <p className="text-center mb-6">
                    Пожалуйста, войдите снова, чтобы продолжить работу.
                </p>
            </div>
        </div>
    )
}

export default SessionExpiredModal
