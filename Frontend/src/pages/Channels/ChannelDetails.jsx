import {
    useBackButton,
    useLaunchParams,
    useMainButton,
} from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useProductStore } from '../../store'
import { useParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Error from '../../Error'
import Loading from '../../Loading'

const ChannelDetails = () => {
    const backButton = useBackButton()
    const mainButton = useMainButton()
    const navigate = useNavigate()
    const { initDataRaw } = useLaunchParams()
    const {
        productDetails,
        busyDay,
        loading,
        error,
        fetchProductDetails,
        fetchBusyDay,
        addToCart,
    } = useProductStore()
    const { id } = useParams() // Получаем product_id из параметров URL
    const [selectedDates, setSelectedDates] = useState([]) // Хранит выбранные даты
    const [format, setFormat] = useState()
    const [post_time, setPostTime] = useState('') // Состояние для хранения выбранного времени
    const [postTimes, setPostTimes] = useState([]) // Состояние для хранения доступных времен

    useEffect(() => {
        fetchProductDetails(initDataRaw, id) // Загружаем данные при первом рендере
        fetchBusyDay(initDataRaw, id)
        // window.addEventListener('scroll', handleScroll)
        // return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchProductDetails, fetchBusyDay, initDataRaw, id])

    const formatNames = {
        1: '1/24',
        2: '2/48',
        3: '3/72',
        4: 'Indefinite',
        5: 'Repost',
        6: 'Response',
        // Добавьте другие форматы по мере необходимости
    }

    const formatList = productDetails?.format_ids || []

    const handleFormatChange = (e) => {
        setFormat(e.target.value)
        // Устанавливаем выбранный формат
    }

    // Обработчик изменения времени
    const handlePostTimeChange = (e) => {
        setPostTime(e.target.value) // Обновляем состояние выбранного времени
    }

    useEffect(() => {
        const handleBackClick = () => {
            window.history.back()
        }

        if (backButton) {
            backButton.show()
            backButton.on('click', handleBackClick)

            return () => {
                backButton.hide()
                backButton.off('click', handleBackClick)
            }
        }
    }, [backButton])

    useEffect(() => {
        if (mainButton) {
            if (selectedDates.length > 0 || format) {
                mainButton.setParams({
                    text: `Купить за ${
                        productDetails.price * selectedDates.length
                    } руб.`,
                    isVisible: true,
                    isEnabled: true,
                    backgroundColor: '#22C55E',
                    textColor: '#ffffff',
                })
            } else {
                mainButton.setParams({
                    isVisible: false,
                    isEnabled: false,
                })
            }

            const handleMainButtonClick = async () => {
                try {
                    console.log(selectedDates)

                    await addToCart(initDataRaw, {
                        product_id: productDetails.product_id,
                        quantity: selectedDates.length,
                        date: selectedDates,
                        post_time: post_time,
                        format: format,
                    })
                    // После успешного добавления товара в корзину перенаправляем на /basket
                    navigate('/basket')
                } catch (error) {
                    console.error('Ошибка при добавлении в корзину:', error)
                }
            }

            mainButton.on('click', handleMainButtonClick)

            return () => {
                mainButton.off('click', handleMainButtonClick)
            }
        }
    }, [mainButton, selectedDates, productDetails])

    const getBusyDays = () => {
        return busyDay.map((item) => new Date(item)) // Преобразуем каждую строку даты в объект Date
    }

    const tileDisabled = ({ date }) => {
        const busyDates = getBusyDays()
        const today = new Date() // Получаем текущую дату

        // Делаем неактивными занятые дни и прошедшие дни
        const isPast = date < today.setHours(0, 0, 0, 0) // Сравниваем даты без учета времени
        const isBusy = busyDates.some(
            (busyDate) =>
                busyDate.getFullYear() === date.getFullYear() &&
                busyDate.getMonth() === date.getMonth() &&
                busyDate.getDate() === date.getDate()
        )

        return isPast || isBusy // Возвращаем true для прошедших или занятых дней
    }

    const handleDateChange = (date) => {
        // Проверка на наличие даты в списке
        const isSelected = selectedDates.some(
            (selectedDate) =>
                selectedDate.getFullYear() === date.getFullYear() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getDate() === date.getDate()
        )

        if (isSelected) {
            // Если дата уже выбрана, удаляем её из списка
            setSelectedDates(
                selectedDates.filter(
                    (selectedDate) => selectedDate.getTime() !== date.getTime()
                )
            )
        } else {
            // Если дата не выбрана, добавляем её в список
            setSelectedDates([...selectedDates, date])
        }
    }

    const tileClassName = ({ date }) => {
        const busyDates = getBusyDays()

        const isSelected = selectedDates.some(
            (selectedDate) =>
                selectedDate.getFullYear() === date.getFullYear() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getDate() === date.getDate()
        )

        const isBusy = busyDates.some(
            (busyDate) =>
                busyDate.getFullYear() === date.getFullYear() &&
                busyDate.getMonth() === date.getMonth() &&
                busyDate.getDate() === date.getDate()
        )

        // Добавляем класс для выделения выбранных дней и занятых дней
        return isSelected
            ? 'bg-green-500 text-white'
            : isBusy
            ? 'bg-gray-400 text-white'
            : ''
    }

    // const handleScroll = () => {
    //     const windowHeight =
    //         'innerHeight' in window
    //             ? window.innerHeight
    //             : document.documentElement.offsetHeight
    //     const body = document.body
    //     const html = document.documentElement
    //     const docHeight = Math.max(
    //         body.scrollHeight,
    //         body.offsetHeight,
    //         html.clientHeight,
    //         html.scrollHeight,
    //         html.offsetHeight
    //     )
    //     const windowBottom = windowHeight + window.pageYOffset
    //     if (windowBottom >= docHeight) {
    //         console.log('Reached the bottom!')
    //     }
    // }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    const er = (100 / productDetails.subscribers_count) * productDetails.views

    return (
        <div className="container mx-auto p-8 min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                {/* Левая часть с информацией о продукте */}
                <div className="flex-1 md:pr-8 mb-2 md:mb-0">
                    <h3 className="text-3xl font-extrabold text-green-400 mb-4">
                        {productDetails.channel_title}
                    </h3>
                    <div className="flex-shrink-0">
                        <img
                            className="rounded-full w-40 h-40 object-cover border-4 border-green-500 shadow-lg"
                            src={`http://localhost:5000/channel_${productDetails.channel_tg_id}.png`}
                            alt={productDetails.channel_title}
                            style={{ aspectRatio: '1/1' }} // Сохранение пропорций изображения
                        />
                    </div>

                    <Link
                        to={`/user/${productDetails.user_uuid}`}
                        className="block text-lg text-blue-500 hover:underline mb-4"
                    >
                        ⭐️ {productDetails.rating} (Рейтинг)
                    </Link>

                    <p className="text-lg mb-3">
                        <span className="font-bold">Описание:</span>{' '}
                        {productDetails.description}
                    </p>
                    <p className="text-lg mb-3">
                        <span className="font-bold">Цена:</span>{' '}
                        {productDetails.price}₽
                    </p>
                    {/* <p className="text-lg mb-3">
                        <span className="font-bold">Время публикации:</span>{' '}
                        {productDetails.post_times}
                    </p> */}
                    <div className="border border-gray-600 rounded-lg p-2 bg-gray-800">
                        <p className="text-sm text-gray-300">
                            Подписчики:{' '}
                            <span className="text-green-400">
                                {productDetails.subscribers_count}
                            </span>
                        </p>
                        <p className="text-sm text-gray-300">
                            Просмотров:{' '}
                            <span className="text-green-400">
                                {Math.round(productDetails.views)}
                            </span>
                        </p>
                        <p className="text-sm text-gray-300">
                            ER:{' '}
                            <span className="text-green-400">
                                {(
                                    (100 / productDetails.subscribers_count) *
                                    productDetails.views
                                ).toFixed(1)}
                                %
                            </span>
                        </p>
                        <p className="text-sm text-gray-300">
                            CPV:{' '}
                            <span className="text-green-400">
                                {Math.round(
                                    productDetails.price / productDetails.views
                                )}{' '}
                                р
                            </span>
                        </p>
                    </div>

                    {/* Выпадающий список для выбора формата */}
                    <div className="mb-6">
                        <label
                            htmlFor="format"
                            className="block text-lg font-semibold mb-2"
                        >
                            Выберите формат:
                        </label>
                        <select
                            id="format"
                            value={format} // Значение выбранного формата
                            onChange={handleFormatChange} // Обработчик изменения формата
                            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-200"
                        >
                            <option value="">Выбрать формат</option>
                            {formatList.map((formatId) => (
                                <option key={formatId} value={formatId}>
                                    {formatNames[formatId] || 'Unknown format'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Выпадающий список для выбора времени */}
                    <div className="mb-6">
                        <label
                            htmlFor="post_time"
                            className="block text-lg font-semibold mb-2"
                        >
                            Выберите время:
                        </label>
                        <select
                            id="post_time"
                            value={post_time} // Значение выбранного времени
                            onChange={handlePostTimeChange} // Обработчик изменения времени
                            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition ease-in-out duration-200"
                        >
                            <option value="">Выбрать время</option>
                            {productDetails.post_times.map((time, index) => (
                                <option key={index} value={time}>
                                    {time.slice(0, 5)}{' '}
                                    {/* Отображаем доступное время */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-lg mb-3">
                        <span className="font-bold">Канал:</span>{' '}
                        {productDetails.channel_name}
                    </p>
                    <p className="text-lg mb-3">
                        <span className="font-bold">Верифицирован:</span>{' '}
                        {productDetails.is_verified ? 'Да' : 'Нет'}
                    </p>
                    <p className="text-lg mb-3">
                        <span className="font-bold">URL Канала:</span>{' '}
                        <a
                            href={productDetails.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {productDetails.channel_url}
                        </a>
                    </p>
                </div>
            </div>

            {/* Блок с календарем */}
            <div className="mt-2">
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                    Выберите даты
                </h3>
                <Calendar
                    onClickDay={handleDateChange} // Используем onClickDay для обработки кликов по дням
                    value={selectedDates} // Массив выбранных дат
                    tileDisabled={tileDisabled} // Делаем неактивными занятые дни
                    tileClassName={tileClassName} // Подсвечиваем выбранные и занятые дни
                    className="bg-gray-900 text-white rounded-lg shadow-lg p-4"
                />
                <p className="text-lg mt-6">
                    Выбранные даты:{' '}
                    {selectedDates
                        .map((date) => date.toLocaleDateString())
                        .join(', ')}
                </p>
            </div>
        </div>
    )
}

export default ChannelDetails
