import React, { useState } from 'react'
import { useProductStore } from '../../store'
import { Link } from 'react-router-dom'
import Person from '../../assets/person.svg'
import View from '../../assets/view.svg'

const ChannelsList = () => {
    const { products, page, totalPages, plusPage, minusPage } =
        useProductStore()

    if (!products || products.length === 0) {
        return (
            <div className="text-white text-center mt-8">
                <p>Нет доступных продуктов</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
            ))}

            <div className="flex justify-between w-full mt-4">
                <button
                    onClick={minusPage}
                    className="px-3 py-2 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                    disabled={page === 1}
                >
                    Назад
                </button>
                <span>
                    Страница {page} из {totalPages}
                </span>
                <button
                    onClick={plusPage}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded bg-gray-700 text-gray-400 disabled:opacity-50"
                >
                    Вперед
                </button>
            </div>
        </div>
    )
}

const ProductCard = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false)

    const firstFormatName =
        product.format_names.length > 0
            ? product.format_names[0]
            : 'Формат не указан'

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex-none">
                <Link to={`${product.product_id}`}>
                    <h3 className="text-xl font-extrabold mb-2 text-green-400">
                        {product.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-400">⭐️ {product.rating}</p>
                <p className="text-base text-gray-300 border-gray-500 border-2 rounded-full px-2 inline-block">
                    {product.category_name}
                </p>
                <div className="relative my-2 ">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center text-base text-gray-300 bg-gray-800 border border-gray-500 rounded-full px-2  focus:outline-none focus:border-blue-500"
                    >
                        {firstFormatName}
                        <svg
                            className={`w-4 h-4 ml-2 transform ${
                                isOpen ? 'rotate-180' : ''
                            } transition-transform duration-200`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {isOpen && (
                        <ul className=" left-0 mt-1  bg-gray-800 shadow-lg rounded-md z-50">
                            {product.format_names.map((format, index) => (
                                <li
                                    key={index}
                                    className="text-gray-300 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                                    onClick={() => {
                                        console.log(format)
                                        setIsOpen(false)
                                    }}
                                >
                                    {format}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mb-2">
                    <InfoBox product={product} />
                </div>
                <p className="font-bold text-2xl text-green-500">
                    {product.price}₽
                </p>
            </div>
            <div className="shrink">
                <img
                    className="rounded-full object-cover border-2 border-green-500 shadow-lg"
                    src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                    alt={product.title}
                />
            </div>
        </div>
    )
}

const InfoBox = ({ product }) => (
    <div className="border flex justify-evenly border-gray-600 rounded-lg p-3 bg-gray-800 gap-2">
        <div className="flex flex-col items-center justify-center">
            <img src={Person} alt="person" />
            <p className="text-sm text-gray-300">
                <span className="text-green-400">
                    {product.subscribers_count}
                </span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <img src={View} alt="view" />
            <p className="text-sm text-gray-300">
                <span className="text-green-400">
                    {Math.round(product.views)}
                </span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <p>ER</p>
            <p className="text-sm text-gray-300">
                <span className="text-green-400">
                    {(
                        (100 / product.subscribers_count) *
                        product.views
                    ).toFixed(1)}
                    %
                </span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <p>CPV</p>
            <p className="text-sm text-gray-300">
                <span className="text-green-400">
                    {Math.round(product.price / product.views)} р
                </span>
            </p>
        </div>
    </div>
)

export default ChannelsList
