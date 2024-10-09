import React from 'react'
import StarError from './assets/starError.webp'

const Error = ({ error }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="max-w-32">
                <img src={StarError} alt="" />
            </div>
            <div className="text-xl font-semibold">{error}</div>
        </div>
    )
}

export default Error
