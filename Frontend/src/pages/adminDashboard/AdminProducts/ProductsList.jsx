import React from 'react'
import { Link } from 'react-router-dom'

const ProductsList = ({
    products,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
}) => {
    return (
        <>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {products.map((product) => (
                    <Link to={`${product.product_id}`} key={product.product_id}>
                        {console.log(product)}
                        <li
                            key={product.product_id}
                            className="mb-4 p-4 rounded-lg bg-dark-gray  shadow transition duration-300 hover:shadow-lg"
                        >
                            <div className="text-xl font-bold">
                                {product.title}
                            </div>
                            <div className="">
                                <span className="font-semibold">
                                    ID продукта:
                                </span>{' '}
                                {product.product_id}
                            </div>
                            <div className="">
                                <span className="font-semibold">
                                    ID пользователя:
                                </span>{' '}
                                {product.user_id}
                            </div>
                            <div className="">
                                <span className="font-semibold">
                                    Категория:
                                </span>{' '}
                                {product.category_id}
                            </div>
                            <div className="">
                                <span className="font-semibold">Описание:</span>{' '}
                                {product.description}
                            </div>
                            <div className="">
                                <span className="font-semibold">Цена:</span>{' '}
                                {product.price} руб.
                            </div>
                            <div className="">
                                <span className="font-semibold">
                                    Время публикации:
                                </span>{' '}
                                {product.post_time}
                            </div>
                            <div className="">
                                <span className="font-semibold">
                                    Дата создания:
                                </span>{' '}
                                {new Date(
                                    product.created_at
                                ).toLocaleDateString()}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 rounded bg-gray-700  disabled:opacity-50"
                >
                    &laquo; Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                            currentPage === i + 1
                                ? 'bg-main-green '
                                : 'bg-gray-700 '
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 rounded bg-gray-700  disabled:opacity-50"
                >
                    Next &raquo;
                </button>
            </div>
        </>
    )
}

export default ProductsList
