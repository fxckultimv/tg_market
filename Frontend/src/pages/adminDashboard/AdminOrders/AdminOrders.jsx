import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import OrderSearch from './OrderSearch'
import OrderList from './OrderList'
import { initDataRaw } from '@telegram-apps/sdk-react'

const AdminOrders = () => {
    const { fetchOrders, loading, error } = useAdminStore()

    useEffect(() => {
        fetchOrders(initDataRaw())
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl ">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center">
            <h2 className="m-6 text-xl font-extrabold text-blue">
                Управление заказами
            </h2>

            <OrderSearch />
            <OrderList />
        </div>
    )
}

export default AdminOrders
