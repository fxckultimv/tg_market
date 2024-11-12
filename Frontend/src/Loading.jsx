import React from 'react'
import StarLoading from './assets/starLoading.webp'

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-dark-gray">
            <div className="max-w-32">
                <img src={StarLoading} alt="" />
            </div>
            <div className="text-xl">Загрузка...</div>
        </div>
    )
}

export default Loading
