import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'

const AdminUsers = () => {
    const { users, user, fetchUsers, fetchUserForId, loading, error } =
        useAdminStore()
    const { initDataRaw } = useLaunchParams()

    const [searchUserId, setSearchUserId] = useState('') // состояние для хранения введенного user_id
    const [searchedUser, setSearchedUser] = useState(null) // состояние для хранения результата поиска
    const [currentPage, setCurrentPage] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const usersPerPage = 10

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

    // Загружаем пользователей только один раз при первом рендере или при поиске
    useEffect(() => {
        fetchUsers(initDataRaw)
    }, [fetchUsers, initDataRaw])

    const handleSearch = useCallback(async () => {
        if (searchUserId.trim()) {
            // Если введен user_id, ищем конкретного пользователя
            await fetchUserForId(initDataRaw, searchUserId)
            setSearchedUser(user) // сохраняем результат поиска
        } else {
            // Если поле пустое, сбрасываем результат поиска и загружаем всех пользователей
            setSearchedUser(null)
            fetchUsers(initDataRaw)
        }
    }, [fetchUserForId, initDataRaw, searchUserId, user, fetchUsers])

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

            {/* Форма для поиска пользователя по user_id */}
            <div className="w-full max-w-4xl mb-6">
                <input
                    type="text"
                    className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                    placeholder="Введите ID пользователя"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                />
                <button
                    className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={handleSearch}
                >
                    Найти пользователя
                </button>
            </div>

            {/* Отображение пользователя, найденного по ID */}
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
                <>
                    {/* Отображение всех пользователей, если не производится поиск */}
                    <ul className="w-full max-w-4xl bg-gray-800 rounded-lg p-2 shadow-md">
                        {Array.isArray(users) &&
                            users.map((user) => (
                                <Link key={user.user_id} to={`${user.user_id}`}>
                                    <li
                                        key={user.user_id}
                                        className="mb-1 p-2 rounded-lg bg-gray-900 text-white shadow transition duration-300 hover:shadow-lg"
                                    >
                                        <div className="text-xl font-bold">
                                            {user.username}
                                        </div>
                                        <div className="text-gray-400">
                                            <span className="font-semibold">
                                                ID:
                                            </span>{' '}
                                            {user.user_id}
                                        </div>
                                        <div className="text-gray-400">
                                            <span className="font-semibold">
                                                Рейтинг:
                                            </span>{' '}
                                            {user.rating}
                                        </div>
                                        <div className="text-gray-400">
                                            <span className="font-semibold">
                                                Дата создания:
                                            </span>{' '}
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </div>
                                    </li>
                                </Link>
                            ))}
                    </ul>
                    <div className="flex justify-center items-center mt-4">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="mx-1 px-3 py-1 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                        >
                            &laquo; Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`mx-1 px-3 py-1 rounded ${
                                    currentPage === i + 1
                                        ? 'bg-green-400 text-white'
                                        : 'bg-gray-700 text-gray-400'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="mx-1 px-3 py-1 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                        >
                            Next &raquo;
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminUsers
