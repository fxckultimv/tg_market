import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import UserSearch from './UserSearch' // Импортируем новый компонент
import UserList from './UserList' // Импортируем новый компонент
import { Link } from 'react-router-dom'
import { initDataRaw } from '@telegram-apps/sdk-react'

const AdminUsers = () => {
    const { users, fetchUsers, loading, error } = useAdminStore()

    useEffect(() => {
        fetchUsers(initDataRaw())
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray ">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray ">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-dark-gray  p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление пользователями
            </h2>
            <UserSearch />
            <UserList />
        </div>
    )
}

export default AdminUsers
