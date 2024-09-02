import React, { useState, useCallback } from 'react'

const ProductsSearch = ({ onSearch, fetchAllProducts }) => {
    const [searchProductId, setSearchProductId] = useState('')

    const handleSearch = useCallback(() => {
        if (searchProductId.trim()) {
            onSearch(searchProductId)
        } else {
            fetchAllProducts()
        }
    }, [searchProductId, onSearch, fetchAllProducts])

    return (
        <div className="w-full max-w-4xl mb-6">
            <input
                type="text"
                className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                placeholder="Введите ID продукта"
                value={searchProductId}
                onChange={(e) => setSearchProductId(e.target.value)}
            />
            <button
                className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={handleSearch}
            >
                Найти продукт
            </button>
        </div>
    )
}

export default ProductsSearch
