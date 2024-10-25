import React, { useState } from 'react'
import { useProductStore } from '../../store'
import { Link } from 'react-router-dom'
import Person from '../../assets/person.svg'
import View from '../../assets/view.svg'
import Loading from '../../Loading'
import Error from '../../Error'

const ChannelsList = () => {
    const { products, page, totalPages, plusPage, minusPage, loading, error } =
        useProductStore()

    if (!products || products.length === 0) {
        return (
            <div className="text-white text-center mt-8">
                <p>Нет доступных продуктов</p>
            </div>
        )
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
            ))}

            <div className="flex justify-between w-full mt-4">
                <button
                    onClick={minusPage}
                    className="px-3 py-2 rounded bg-gray-700 text-light-gray disabled:opacity-50"
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
                    className="px-3 py-2 rounded bg-gray-700 text-light-gray disabled:opacity-50"
                >
                    Вперед
                </button>
            </div>
        </div>
    )
}

const ProductCard = ({ product }) => {
    const [isOpenFormar, setIsOpenFormat] = useState(false)
    const [isOpenPostTime, setIsOpenPostTime] = useState(false)

    const firstFormatName =
        product.format_names.length > 0
            ? product.format_names[0]
            : 'Формат не указан'

    // Получаем первое время из массива post_times или выводим "Время не указано"
    const firstPostTime =
        product.post_times.length > 0
            ? product.post_times[0].slice(0, 5) // Предполагается, что в post_times есть поле label
            : 'Время не указано'

    return (
        <div className="bg-gradient-to-r from-dark-gray to-medium-gray p-4 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="flex-none">
                <Link to={`${product.product_id}`}>
                    <h3 className="text-xl font-extrabold mb-2 text-main-green">
                        {product.title}
                    </h3>

                    <p className="text-sm text-light-gray">
                        ⭐️ {product.rating}
                    </p>
                    <p className="text-base text-gray-300 border-main-gray border border-main-gray rounded-full px-2 inline-block">
                        {product.category_name}
                    </p>
                    {/* <p>{product.post_times.slice(0, 5)}</p> */}
                </Link>
                <div className="relative my-2 ">
                    <button
                        onClick={() => setIsOpenFormat(!isOpenFormar)}
                        className="flex items-center text-base text-gray-300 bg-medium-gray border border-main-gray rounded-full px-2  focus:outline-none focus:border-blue-500"
                    >
                        {firstFormatName}
                        <svg
                            className={`w-4 h-4 ml-2 transform ${
                                isOpenFormar ? 'rotate-180' : ''
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
                    {isOpenFormar && (
                        <ul className=" left-0 mt-1  bg-medium-gray shadow-lg rounded-md z-50">
                            {product.format_names.map((format, index) => (
                                <li
                                    key={index}
                                    className="text-gray-300 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                                    onClick={() => {
                                        console.log(format)
                                        setIsOpenFormat(false)
                                    }}
                                >
                                    {format}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="relative my-2">
                    <button
                        onClick={() => setIsOpenPostTime(!isOpenPostTime)}
                        className="flex items-center text-base text-gray-300 bg-medium-gray border border-main-gray rounded-full px-2 focus:outline-none focus:border-blue-500"
                    >
                        {firstPostTime}
                        <svg
                            className={`w-4 h-4 ml-2 transform ${
                                isOpenPostTime ? 'rotate-180' : ''
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
                    {isOpenPostTime && (
                        <ul className="left-0 mt-1 bg-medium-gray shadow-lg rounded-md z-50">
                            {product.post_times.map((time, index) => (
                                <li
                                    key={index}
                                    className="text-gray-300 p-2 hover:bg-gray-700 cursor-pointer rounded-md"
                                    onClick={() => {
                                        console.log(time)
                                        setIsOpenPostTime(false)
                                    }}
                                >
                                    {time.slice(0, 5)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mb-2">
                    <InfoBox product={product} />
                </div>
                <p className="font-bold text-2xl text-accent-green">
                    {product.price}₽
                </p>
            </div>
            <div className="shrink">
                <img
                    className="rounded-full object-cover border-2 border-accent-green shadow-lg"
                    src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                    alt={product.title}
                />
            </div>
        </div>
    )
}

const InfoBox = ({ product }) => (
    <div className="border flex justify-evenly border-main-gray rounded-lg p-3 bg-medium-gray gap-2">
        <div className="flex flex-col items-center justify-center">
            <img src={Person} alt="person" />
            <p className="text-sm text-gray-300">
                <span className="text-main-green">
                    {product.subscribers_count}
                </span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <img src={View} alt="view" />
            <p className="text-sm text-gray-300">
                <span className="text-main-green">
                    {Math.round(product.views)}
                </span>
            </p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <p>ER</p>
            <p className="text-sm text-gray-300">
                <span className="text-main-green">
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
                <span className="text-main-green">
                    {Math.round(product.price / product.views)} р
                </span>
            </p>
        </div>
    </div>
)

export default ChannelsList
