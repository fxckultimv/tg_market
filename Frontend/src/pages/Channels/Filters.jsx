import React, { useEffect, useState } from 'react'
import { useProductStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import Document from '../../assets/document.svg'
import settings from '../../assets/settings.svg'
import { motion } from 'framer-motion'
import { div } from 'framer-motion/client'

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

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
    const [sort, setSort] = useState(false)

    // Дебаунс для поискового запроса и фильтров
    const debouncedSearchQuery = useDebounce(searchQuery, 500) // 500 мс задержки
    const debouncedFilters = useDebounce(filters, 500)

    // Fetch categories from the server when initDataRaw changes
    useEffect(() => {
        fetchCategories(initDataRaw)
    }, [initDataRaw, fetchCategories])

    // Fetch products when search query, filters, or current page change
    useEffect(() => {
        fetchProducts(initDataRaw)
    }, [
        debouncedSearchQuery,
        debouncedFilters,
        page,
        fetchProducts,
        initDataRaw,
    ])

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
        setPage(1) // Сброс на первую страницу при новом поиске
    }

    const handleCategoryChange = (e) => {
        setFilters({ ...filters, category: e.target.value })
        setPage(1) // Сброс на первую страницу при изменении категории
    }

    const handleFormat = (e) => {
        setFilters({ ...filters, format: e.target.value })
        setPage(1) // Сброс на первую страницу при изменении категории
    }

    const handleMinPriceChange = (e) => {
        const value = e.target.value // Обработка пустых значений
        if (value === '') {
            setFilters({
                priceRange: ['', filters.priceRange[1]],
            })
        } else {
            setFilters({
                priceRange: [value, filters.priceRange[1]], // Обновляем только минимальное значение
            })
        }
        setPage(1) // Сбрасываем страницу
    }

    const handleMaxPriceChange = (e) => {
        const value = e.target.value // Обработка пустых значений
        if (value === '') {
            setFilters({
                priceRange: ['', filters.priceRange[0]],
            })
        } else {
            setFilters({
                priceRange: [filters.priceRange[0], value], // Обновляем только максимальное значение
            })
        }
        setPage(1) // Сбрасываем страницу
    }

    const handlerSort = (value) => {
        setFilters({ ...filters, sort: value })
        setPage(1)
    }

    const toggleFilters = () => {
        setIsExpanded(!isExpanded)
    }

    const toggleSort = () => {
        setSort(!sort)
    }

    console.log(filters.sort)

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3 mt-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img src={Document} alt="Документ" className="h-[32px]" />
                </div>
                <h1 className="text-text text-5xl max-md:text-3xl">
                    Объявления
                </h1>
            </div>
            <div className="flex flex-col items-center w-full mt-6 mb-8 p-3">
                {/* Поле поиска */}
                <div className="w-full max-w-md mb-4">
                    <input
                        type="search"
                        placeholder="Поиск объявлений"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded-lg outline-none  placeholder-gray-400 focus:ring-2 focus:ring-blue"
                    />
                </div>
                {/* Кнопка для фильтров */}
                <div>
                    {' '}
                    <div className="w-full">
                        <button
                            onClick={toggleFilters}
                            className="flex items-center px-4 py-2 bg-blue text-white rounded-full hover:bg-blue-600 transition"
                        >
                            <img
                                src={settings}
                                alt="Tune icon"
                                className="w-5 h-5 mr-2"
                            />
                            Показать фильтры
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-start mx-3 relative pr-16 max-md:pr-5 max-xl:pr-8">
                <div className="p-1 rounded-full bg-gray" onClick={toggleSort}>
                    <motion.img
                        animate={sort ? { rotate: 360 } : {}}
                        transition={{ duration: 0.5 }}
                        src={settings}
                        alt="Tune icon"
                        className="w-5 h-5 m-2"
                    />
                </div>
            </div>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ opacity: 'hidden' }}
                animate={
                    sort
                        ? { height: 'auto', opacity: 1 }
                        : { height: 0, opacity: 0 }
                }
                className="absolute flex flex-col m-2 p-2 rounded-xl bg-card-white text-base "
            >
                <ul>
                    <li
                        onClick={() => handlerSort('asc')}
                        className={`cursor-pointer p-2 rounded-lg ${
                            filters.sort === 'asc' ? 'bg-blue' : ''
                        }`}
                    >
                        Дешевле
                    </li>
                    <li
                        onClick={() => handlerSort('desc')}
                        className={`cursor-pointer p-2 rounded-lg ${
                            filters.sort === 'desc' ? 'bg-blue' : ''
                        }`}
                    >
                        Дороже
                    </li>
                </ul>
            </motion.div>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                    isExpanded
                        ? { height: 'auto', opacity: 1 }
                        : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.5 }}
                style={{ overflow: 'hidden' }}
                className="bg-medium-gray  rounded-b-lg"
            >
                <div className="space-y-2">
                    {/* Category Filter */}
                    <div>
                        <select
                            id="category"
                            value={filters.category || ''}
                            onChange={handleCategoryChange}
                            className="w-full p-2 bg-gray-700 rounded  outline-none bg-gray"
                        >
                            <option value="">Категория</option>
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
                    <div>
                        <select
                            id="ad-format"
                            className="w-full p-2 bg-gray-700 rounded  outline-none bg-gray"
                            value={filters.format || ''}
                            onChange={handleFormat}
                        >
                            <option value="">Формат</option>
                            <option value="1">
                                1/24 (1 публикация в течение 24 часов)
                            </option>
                            <option value="2">
                                2/48 (2 публикации в течение 48 часов)
                            </option>
                            <option value="3">
                                2/72 (3 публикации в течение 72 часов)
                            </option>
                            <option value="4">
                                Бессрочный (Реклама навсегда в канале)
                            </option>
                            <option value="5">
                                Репост (Репост поста из канала)
                            </option>
                            <option value="6">
                                Ответка (Дополнительнвй пост через 30 минут
                                после основного)
                            </option>
                        </select>
                    </div>

                    {/* Price Filter */}
                    <div className="flex items-center justify-between">
                        <div className="w-full mr-2">
                            <label htmlFor="min-price" className="block mb-2">
                                Мин. цена
                            </label>
                            <input
                                id="min-price"
                                type="number"
                                value={
                                    filters.priceRange[0] === ''
                                        ? ''
                                        : filters.priceRange[0]
                                }
                                onChange={handleMinPriceChange}
                                className="w-full p-2 bg-gray-700 rounded bg-blue text-white  outline-none"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="max-price" className="block mb-2">
                                Макс. цена
                            </label>
                            <input
                                id="max-price"
                                type="number"
                                value={
                                    filters.priceRange[1] === ''
                                        ? ''
                                        : filters.priceRange[1]
                                }
                                onChange={handleMaxPriceChange}
                                className="w-full p-2 bg-gray-700 rounded  outline-none bg-blue bg"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Filters
