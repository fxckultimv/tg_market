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

    useEffect(() => {
        fetchProductDetails(initDataRaw, id) // Загружаем данные при первом рендере
        fetchBusyDay(initDataRaw, id)
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
                        post_time: productDetails.post_time,
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
        return busyDates.some(
            (busyDate) =>
                busyDate.getFullYear() === date.getFullYear() &&
                busyDate.getMonth() === date.getMonth() &&
                busyDate.getDate() === date.getDate()
        )
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
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
        <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white ">
            <div className="flex justify-center items-center">
                <div className="flex-1">
                    <h3 className="text-2xl mb-4">
                        {productDetails.channel_title}
                    </h3>

                    <Link to={`/user/${productDetails.user_uuid}`}>
                        <p>⭐️{productDetails.rating}</p>
                    </Link>
                    <p className="text-lg">
                        Описание: {productDetails.description}
                    </p>
                    <p className="text-lg">Цена: {productDetails.price} руб.</p>
                    <p className="text-lg">
                        Время публикации:{productDetails.post_time}
                    </p>
                    <p>Подписчики: {productDetails.subscribers_count}</p>
                    <p>Просмотров за 24ч: {Math.round(productDetails.views)}</p>
                    <p>
                        ER:{' '}
                        {(
                            (100 / productDetails.subscribers_count) *
                            productDetails.views
                        ).toFixed(1)}
                        %
                    </p>
                    <p>
                        CPV:{' '}
                        {Math.round(
                            productDetails.price / productDetails.views
                        )}
                        р
                    </p>

                    {/* Выпадающий список для выбора формата */}
                    <label htmlFor="format" className="block text-lg mb-2">
                        Выберите формат:
                    </label>
                    <select
                        id="format"
                        value={format} // Значение выбранного формата
                        onChange={handleFormatChange} // Обработчик изменения формата
                        className="w-full p-2 bg-gray-700 rounded text-white outline-none"
                    >
                        <option value="">Выбрать формат</option>
                        {formatList.map((formatId) => (
                            <option key={formatId} value={formatId}>
                                {formatNames[formatId] || 'Unknown format'}
                            </option>
                        ))}
                    </select>

                    {/* Отображение выбранного формата
                    {format && (
                        <p className="text-lg mt-4">
                            Выбранный формат: {formatNames[format]}
                        </p>
                    )} */}

                    <p className="text-lg">
                        Канал: {productDetails.channel_name}
                    </p>
                    <p className="text-lg">
                        Верифицирован:{' '}
                        {productDetails.is_verified ? 'Да' : 'Нет'}
                    </p>
                    <p className="text-lg">
                        URL Канала:{' '}
                        <a
                            href={productDetails.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {productDetails.channel_url}
                        </a>
                    </p>
                </div>
                <div>
                    <img
                        className="rounded-full w-32 h-32 object-cover border-green-400 border-2"
                        src={`http://localhost:5000/channel_${productDetails.channel_tg_id}.png`}
                        alt={productDetails.channel_title}
                    />
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-2xl mb-4">Выберите даты</h3>
                <Calendar
                    onClickDay={handleDateChange} // Используем onClickDay для обработки кликов по дням
                    value={selectedDates} // Массив выбранных дат
                    tileDisabled={tileDisabled} // Делаем неактивными занятые дни
                    tileClassName={tileClassName} // Подсвечиваем выбранные и занятые дни
                    className="bg-gray-900 text-white rounded shadow-lg"
                />
                <p className="mt-4">
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
