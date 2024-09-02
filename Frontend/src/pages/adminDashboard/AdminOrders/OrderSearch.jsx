import React, { useState, useCallback } from 'react'

const OrderSearch = ({ onSearch, fetchAllOrders }) => {
    const [searchOrderId, setSearchOrderId] = useState('')

    const handleSearch = useCallback(() => {
        if (searchOrderId.trim()) {
            onSearch(searchOrderId)
        } else {
            fetchAllOrders()
        }
    }, [searchOrderId, onSearch, fetchAllOrders])

    return (
        <div className="w-full max-w-4xl mb-6">
            <input
                type="text"
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                placeholder="Введите ID заказа"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
            />
            <button
                className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleSearch}
            >
                Найти заказ
            </button>
        </div>
    )
}

export default OrderSearch
