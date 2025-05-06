import React, { useState, useCallback } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { useAdminStore } from '../../../store'

const ProductsSearch = () => {
    const { fetchProducts, total } = useAdminStore()
    const [name, setName] = useState()

    const handleSearch = useCallback(() => {
        fetchProducts(initDataRaw(), name)
    }, [name])

    return (
        <>
            <div className="flex w-full max-w-4xl mb-4 text-black">
                <input
                    type="text"
                    className="w-full p-2 m-2 rounded bg-medium-gray "
                    placeholder="Введите название канала"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

export default ProductsSearch
