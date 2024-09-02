import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import UserSearch from './UserSearch' // Импортируем новый компонент
import UserList from './UserList' // Импортируем новый компонент
import { Link } from 'react-router-dom'

const AdminUsers = () => {
    const { users, user, fetchUsers, fetchUserForId, loading, error } =
        useAdminStore()
    const { initDataRaw } = useLaunchParams()

    const [currentPage, setCurrentPage] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const usersPerPage = 10
    const [searchedUser, setSearchedUser] = useState(null)

    // Используем useEffect, чтобы делать запрос при изменении currentPage
    useEffect(() => {
        const skip = (currentPage - 1) * usersPerPage
        fetchUsers(initDataRaw, skip, usersPerPage).then((data) => {
            if (data) {
                setTotalUsers(data.total) // Устанавливаем общее количество пользователей
            }
        })
    }, [fetchUsers, initDataRaw, currentPage])

    const totalPages = Math.ceil(totalUsers / usersPerPage)

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleSearch = useCallback(
        async (userId) => {
            await fetchUserForId(initDataRaw, userId)
            setSearchedUser(user) // сохраняем результат поиска
        },
        [fetchUserForId, initDataRaw, user]
    )

    const fetchAllUsers = useCallback(() => {
        setSearchedUser(null)
        fetchUsers(initDataRaw)
    }, [fetchUsers, initDataRaw])

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
        <div className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-1">
            <h2 className="mb-6 text-xl font-extrabold text-green-400">
                Управление пользователями
            </h2>

            <UserSearch onSearch={handleSearch} fetchAllUsers={fetchAllUsers} />

            {searchedUser && searchedUser.user_id ? (
                <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                    <Link
                        key={searchedUser.user_id}
                        to={`${searchedUser.user_id}`}
                    >
                        <li className="mb-4 p-4 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg">
                            <div className="text-xl font-bold">
                                {searchedUser.username}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">ID:</span>{' '}
                                {searchedUser.user_id}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">Рейтинг:</span>{' '}
                                {searchedUser.rating}
                            </div>
                            <div className="text-gray-400">
                                <span className="font-semibold">
                                    Дата создания:
                                </span>{' '}
                                {new Date(
                                    searchedUser.created_at
                                ).toLocaleDateString()}
                            </div>
                        </li>
                    </Link>
                </ul>
            ) : (
                <UserList
                    users={users}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    )
}

export default AdminUsers