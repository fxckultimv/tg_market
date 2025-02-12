import React from 'react'

const HowCreate = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Как добавить канал на биржу?
                </h2>
                <p className="text-gray-700 mb-2">
                    1️⃣ Добавьте нашего бота в ваш канал.
                </p>
                <p className="text-gray-700 mb-2">
                    2️⃣ Выдайте боту права администратора для управления
                    рекламой.
                </p>
                <p className="text-gray-700 mb-2">
                    3️⃣ Если вы являетесь администратором канала, у вас появится
                    возможность создать продукт для него.
                </p>
                <p className="text-gray-700 font-semibold mt-4">
                    После этого ваш канал появится на бирже, и вы сможете
                    продавать рекламу! 🚀
                </p>
            </div>
        </div>
    )
}

export default HowCreate
