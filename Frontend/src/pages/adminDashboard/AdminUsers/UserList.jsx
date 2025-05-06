import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../../store'
import { useState } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'

const UserList = () => {
    const {
        users,
        fetchUsers,
        skip = 0,
        limit = 10,
        total = 0,
    } = useAdminStore()

    const handlePrev = () => {
        if (skip >= limit) {
            fetchUsers(initDataRaw(), null, skip - limit, limit)
        }
    }

    const handleNext = () => {
        if (skip + limit < total) {
            fetchUsers(initDataRaw(), null, skip + limit, limit)
        }
    }

    if (!users || users.length === 0) {
        return (
            <div className="text-center text-gray-500">Пользователей нету</div>
        )
    }
    return (
        <div className="w-full max-w-5xl bg-medium-gray rounded-lg p-4 shadow-md">
            {/* Заголовки */}
            <div className="grid grid-cols-4 gap-4 font-bold text-white mb-2 px-2">
                <div>Имя</div>
                <div>ID</div>
                <div>Рейтинг</div>
                <div>Дата создания</div>
            </div>

            {/* Список пользователей */}
            <div className="space-y-2">
                {users.map((user) => (
                    <Link key={user.user_id} to={`${user.user_id}`}>
                        <div className="grid grid-cols-4 gap-4 items-center bg-dark-gray px-2 py-3 hover:shadow-lg transition border-[1px]">
                            <div className="text-white font-semibold">
                                {user.username}
                            </div>
                            <div className="text-gray-400">{user.user_id}</div>
                            <div className="text-gray-300">{user.rating}</div>
                            <div className="text-gray-300">
                                {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4 text-white">
                <button
                    onClick={handlePrev}
                    disabled={skip === 0}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Назад
                </button>
                <div>
                    Страница {Math.floor(skip / limit) + 1} из{' '}
                    {Math.ceil(total / limit)}
                </div>
                <button
                    onClick={handleNext}
                    disabled={skip + limit >= total}
                    className="bg-dark-gray px-4 py-2 rounded disabled:opacity-50"
                >
                    Вперёд
                </button>
            </div>
        </div>
    )
}

export default UserList
