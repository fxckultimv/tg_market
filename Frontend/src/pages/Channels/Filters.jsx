import React, { useEffect, useState } from 'react'
import { useProductStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import Tune from '../../assets/tune.svg'

const Filters = () => {
    const {
        categories,
        filters,
        searchQuery,
        page,
        totalPages,
        setSearchQuery,
        setFilters,
        setPage,
        fetchProducts,
        fetchCategories,
    } = useProductStore()

    const { initDataRaw } = useLaunchParams()

    const [isExpanded, setIsExpanded] = useState(false)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(100000)

    // Fetch categories from the server when initDataRaw changes
    useEffect(() => {
        fetchCategories(initDataRaw)
    }, [initDataRaw, fetchCategories])

    // Fetch products when search query, filters, or current page change
    useEffect(() => {
        fetchProducts(initDataRaw)
    }, [searchQuery, filters, page, fetchProducts, initDataRaw])

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
        setPage(1) // Сброс на первую страницу при новом поиске
    }

    const handleCategoryChange = (e) => {
        setFilters({ ...filters, category: e.target.value })
        setPage(1) // Сброс на первую страницу при изменении категории
    }

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value)
        setPage(1) // Сброс на первую страницу при изменении цены
    }

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value)
        setPage(1) // Сброс на первую страницу при изменении цены
    }

    const toggleFilters = () => {
        setIsExpanded(!isExpanded)
    }

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Поиск продуктов..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 bg-gray-700 rounded text-white outline-none"
                />
                <img
                    src={Tune}
                    alt="tune"
                    onClick={toggleFilters}
                    className="ml-4 w-8 h-8 cursor-pointer transition-transform transform hover:scale-110"
                />
            </div>

            {isExpanded && (
                <div className="space-y-4">
                    {/* Category Filter */}
                    <div>
                        <label htmlFor="category" className="block mb-2">
                            Категория
                        </label>
                        <select
                            id="category"
                            value={filters.category || ''}
                            onChange={handleCategoryChange}
                            className="w-full p-2 bg-gray-700 rounded text-white outline-none"
                        >
                            <option value="">Выбрать категорию</option>
                            {categories.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Filter */}
                    <div className="flex items-center justify-between">
                        <div className="w-full mr-2">
                            <label htmlFor="min-price" className="block mb-2">
                                Мин. цена: {minPrice}
                            </label>
                            <input
                                id="min-price"
                                type="range"
                                min="0"
                                max="100000"
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                className="w-full"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="max-price" className="block mb-2">
                                Макс. цена: {maxPrice}
                            </label>
                            <input
                                id="max-price"
                                type="range"
                                min="0"
                                max="1000000"
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 rounded text-white disabled:opacity-50"
                >
                    Предыдущая
                </button>
                <span>
                    Страница {page} из {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 rounded text-white disabled:opacity-50"
                >
                    Следующая
                </button>
            </div>
        </div>
    )
}

export default Filters
