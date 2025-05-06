import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import ProductsSearch from './ProductsSearch'
import ProductsList from './ProductsList'
import { initDataRaw } from '@telegram-apps/sdk-react'

const AdminProducts = () => {
    const { fetchProducts, loading, error } = useAdminStore()

    useEffect(() => {
        fetchProducts(initDataRaw())
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center p-1">
            <h2 className="m-6 text-xl font-extrabold text-main-green">
                Управление продуктами
            </h2>

            <ProductsSearch />
            <ProductsList />
        </div>
    )
}

export default AdminProducts
