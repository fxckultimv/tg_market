import React, { useEffect, useState, useCallback } from 'react'
import { useAdminStore } from '../../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import ProductsSearch from './ProductsSearch'
import ProductsList from './ProductsList'

const AdminProducts = () => {
    const {
        product,
        products,
        fetchProducts,
        fetchProductsForId,
        loading,
        error,
    } = useAdminStore()
    const { initDataRaw } = useLaunchParams()

    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const productsPerPage = 10
    const [searchedProduct, setSearchedProduct] = useState(null)

    // Используем useEffect, чтобы делать запрос при изменении currentPage
    useEffect(() => {
        const skip = (currentPage - 1) * productsPerPage
        fetchProducts(initDataRaw, skip, productsPerPage).then((data) => {
            if (data) {
                setTotalProducts(data.total) // Устанавливаем общее количество продуктов
            }
        })
    }, [fetchProducts, initDataRaw, currentPage])

    const totalPages = Math.ceil(totalProducts / productsPerPage)

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleSearch = useCallback(
        async (productId) => {
            await fetchProductsForId(initDataRaw, productId)
            setSearchedProduct(product) // сохраняем результат поиска
        },
        [fetchProductsForId, initDataRaw, product]
    )

    const fetchAllProducts = useCallback(() => {
        setSearchedProduct(null)
        fetchProducts(initDataRaw)
    }, [fetchProducts, initDataRaw])

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
        <div className="flex min-h-screen flex-col items-center  p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление продуктами
            </h2>

            <ProductsSearch
                onSearch={handleSearch}
                fetchAllProducts={fetchAllProducts}
            />

            {searchedProduct && searchedProduct.product_id ? (
                <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                    <li
                        key={searchedProduct.product_id}
                        className="mb-4 p-4 rounded-lg  shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-xl font-bold">
                            {searchedProduct.title}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">ID продукта:</span>{' '}
                            {searchedProduct.product_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                ID пользователя:
                            </span>{' '}
                            {searchedProduct.user_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Категория:</span>{' '}
                            {searchedProduct.category_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Описание:</span>{' '}
                            {searchedProduct.description}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Цена:</span>{' '}
                            {searchedProduct.price} руб.
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                Время публикации:
                            </span>{' '}
                            {searchedProduct.post_time}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                Дата создания:
                            </span>{' '}
                            {new Date(
                                searchedProduct.created_at
                            ).toLocaleDateString()}
                        </div>
                    </li>
                </ul>
            ) : (
                <ProductsList
                    products={products}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    )
}

export default AdminProducts
