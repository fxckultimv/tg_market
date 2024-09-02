import React, { useState, useCallback } from 'react'

const UserSearch = ({ onSearch, fetchAllUsers }) => {
    const [searchUserId, setSearchUserId] = useState('')

    const handleSearch = useCallback(() => {
        if (searchUserId.trim()) {
            onSearch(searchUserId)
        } else {
            fetchAllUsers()
        }
    }, [searchUserId, onSearch, fetchAllUsers])

    return (
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
    )
}

export default UserSearch
