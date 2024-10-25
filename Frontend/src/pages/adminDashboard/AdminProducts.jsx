import React, { useEffect, useState } from 'react'
import { useAdminStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'

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

    // Используем useEffect, чтобы делать запрос при изменении currentPage
    useEffect(() => {
        const skip = (currentPage - 1) * productsPerPage
        fetchProducts(initDataRaw, skip, productsPerPage).then((data) => {
            if (data) {
                setTotalProducts(data.total) // Устанавливаем общее количество продуктов
            }
        })
    }, [fetchProducts, initDataRaw, currentPage])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

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

    return (
        <div className="flex min-h-screen flex-col items-center bg-dark-gray text-white p-1">
            <h2 className="mb-6 text-xl font-extrabold text-main-green">
                Управление продуктами
            </h2>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {products.map((product) => (
                    <li
                        key={product.product_id}
                        className="mb-4 p-4 rounded-lg bg-dark-gray text-white shadow transition duration-300 hover:shadow-lg"
                    >
                        <div className="text-xl font-bold">{product.title}</div>
                        <div className="text-light-gray">
                            <span className="font-semibold">ID продукта:</span>{' '}
                            {product.product_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                ID пользователя:
                            </span>{' '}
                            {product.user_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Категория:</span>{' '}
                            {product.category_id}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Описание:</span>{' '}
                            {product.description}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">Цена:</span>{' '}
                            {product.price} руб.
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                Время публикации:
                            </span>{' '}
                            {product.post_time}
                        </div>
                        <div className="text-light-gray">
                            <span className="font-semibold">
                                Дата создания:
                            </span>{' '}
                            {new Date(product.created_at).toLocaleDateString()}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 rounded bg-gray-700 text-light-gray disabled:opacity-50"
                >
                    &laquo; Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                            currentPage === i + 1
                                ? 'bg-main-green text-white'
                                : 'bg-gray-700 text-light-gray'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 rounded bg-gray-700 text-light-gray disabled:opacity-50"
                >
                    Next &raquo;
                </button>
            </div>
        </div>
    )
}

export default AdminProducts
