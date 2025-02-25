import React, { useState } from 'react'
import { useProductStore } from '../../store'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Error from '../../Error'
import { useNavigate } from 'react-router-dom'
import arrowDown from '../../assets/chevron-down-gray.svg'
import star from '../../assets/star.svg'
import Arrow from '../../assets/Arrow.svg'
import InfoBox from '../../components/InfoBox'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

const ChannelsList = () => {
    const { products, page, totalPages, plusPage, minusPage, loading, error } =
        useProductStore()

    if (!products || products.length === 0) {
        return (
            <div className="bg-white text-center mt-8">
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
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-16 max-md:p-5 max-xl:p-8">
                {products.map((product) => (
                    <ProductCard key={product.product_id} product={product} />
                ))}
            </div>
            <div className="flex justify-center w-full mt-4 items-center gap-3">
                <button
                    onClick={minusPage}
                    className="px-3 py-2 rounded bg-gray disabled:opacity-50"
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
                    className="px-3 py-2 rounded bg-gray disabled:opacity-50"
                >
                    Вперед
                </button>
            </div>
        </>
    )
}

const ProductCard = ({ product }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenFormat, setIsOpenFormat] = useState(false)
    const [isOpenPostTime, setIsOpenPostTime] = useState(false)
    const navigate = useNavigate()

    const handleButtonClick = (event, action) => {
        event.preventDefault() // Предотвращает переход по ссылке
        event.stopPropagation() // Останавливает всплытие события
        action()
    }

    const toggleItem = (index) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [index]: !prevOpenItems[index],
        }))
    }

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
        <div className="flex gap-4 flex-col">
            <Link
                to={product.product_id}
                className="bg-card-white  shadow-card p-4 rounded-3xl"
            >
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h2 className=" text-2xl">{product.title}</h2>
                        <div className="flex gap-3">
                            <div className="flex">
                                <p className=" text-base border-2 border-gray rounded-full px-3 max-sm:text-xs">
                                    {product.category_name}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <img src={star} alt="" />
                                <p className=" text-base max-sm:text-xs">
                                    {product.rating}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="aspect-square">
                        <img
                            src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                            alt={product.title}
                            className="rounded-full max-h-[111px] max-w-[111px]"
                        />
                    </div>
                </div>

                <div className="bg-gray w-full h-[1px] my-3"></div>
                <div
                    onClick={(e) =>
                        handleButtonClick(e, () => setIsOpen(!isOpen))
                    }
                >
                    <div className="flex gap-3">
                        {/* Заголовок с кнопкой для открытия/закрытия */}
                        <p className="text-lg max-sm:text-base cursor-pointer">
                            Статистика
                        </p>
                        <img
                            src={arrowDown}
                            alt="Toggle"
                            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </div>

                    {/* Анимированное появление */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: 'easeInOut',
                                }}
                                className="overflow-hidden"
                            >
                                <InfoBox product={product} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="bg-gray w-full h-[1px] my-3"></div>

                <div className="flex justify-between items-start text-text">
                    <div className="flex gap-2">
                        <div className="relative text-center">
                            <button
                                onClick={(e) =>
                                    handleButtonClick(e, () =>
                                        setIsOpenFormat(!isOpenFormat)
                                    )
                                }
                                className="flex relative flex-col justify-between items-center w-full px-3 py-2 border-[1px] rounded-2xl border-gray hover:border-gray-400 transition-all duration-200"
                            >
                                <div className="flex justify-between w-full gap-1">
                                    <p className="flex-grow text-left text-base">
                                        {firstFormatName}
                                    </p>
                                    <img
                                        src={arrowDown}
                                        alt="Toggle"
                                        className={`transform transition-transform duration-300 ${isOpenFormat ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </div>{' '}
                                <div
                                    className={`overflow-hidden absolute transition-all top-0 duration-300 ease-in-out border-gray border-[1px] rounded-2xl w-full ${isOpenFormat ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <ul className="bg-background shadow-lg rounded-md overflow-hidden mt-1 z-50">
                                        {product.format_names.map(
                                            (format, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:text-gray cursor-pointer transition-all"
                                                    onClick={() => {
                                                        console.log(format)
                                                        setIsOpenFormat(false)
                                                    }}
                                                >
                                                    {format}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </button>
                        </div>

                        <div className="relative text-center">
                            <button
                                onClick={(e) =>
                                    handleButtonClick(e, () =>
                                        setIsOpenPostTime(!isOpenPostTime)
                                    )
                                }
                                className="flex relative flex-col justify-between items-center w-full px-3 py-2 border-[1px] rounded-2xl border-gray transition-all duration-200"
                            >
                                <div className="flex justify-between w-full gap-1">
                                    <p className="flex-grow text-left text-base">
                                        {firstPostTime}
                                    </p>
                                    <img
                                        src={arrowDown}
                                        alt="Toggle"
                                        className={`transform transition-transform duration-300 ${isOpenPostTime ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </div>
                                <div
                                    className={`overflow-hidden absolute top-0 transition-all duration-300 ease-in-out border-gray border-[1px] rounded-2xl w-full ${isOpenPostTime ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <ul className="bg-background shadow-lg rounded-md overflow-hidden mt-1 z-50">
                                        {product.post_times.map(
                                            (time, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:text-gray cursor-pointer transition-all"
                                                    onClick={() => {
                                                        console.log(time)
                                                        setIsOpenPostTime(false)
                                                    }}
                                                >
                                                    {time.slice(0, 5)}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl max-md:text-xl ">
                                {nanoTonToTon(product.price)}
                            </p>
                            <img
                                src={Ton}
                                alt=""
                                className="h-[2em] w-auto inline-block align-middle"
                                style={{ verticalAlign: 'middle' }}
                            />
                        </div>
                        {/* <h2 className="text-3xl">{product.price} ₽</h2> */}
                    </div>
                </div>

                {/* <p className="font-bold text-2xl text-accent-green">
                    {product.price}₽
                </p>{' '} */}
            </Link>
        </div>
    )
}

export default ChannelsList
