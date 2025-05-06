import React, { useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import { initDataRaw } from '@telegram-apps/sdk-react'

const OrderSearch = () => {
    const { fetchOrders, total } = useAdminStore()
    const [id, setId] = useState()

    const handleSearch = useCallback(() => {
        fetchOrders(initDataRaw(), id)
    }, [id])

    return (
        <>
            <div className="flex w-full max-w-4xl mb-4 text-black">
                <input
                    type="text"
                    className="w-full p-2 m-2 rounded bg-medium-gray "
                    placeholder="Введите id заказа"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <button
                    className="w-full bg-blue rounded max-w-[200px] text-white"
                    onClick={handleSearch}
                >
                    <p>Найти</p>
                </button>
            </div>
            <div className="items-start text-start p-2">
                <p>всего: {total}</p>
            </div>
        </>
    )
}

export default OrderSearch
