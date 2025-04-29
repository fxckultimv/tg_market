import { mainButton, useSignal, hapticFeedback } from '@telegram-apps/sdk-react'
import React, { useEffect, useState } from 'react'
import { useProductStore } from '../../store'
import { useParams, useSearchParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import './CalendarStyles.css'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Error from '../../Error'
import Loading from '../../Loading'
import InfoBox from '../../components/InfoBox'
import Ton from '../../assets/ton_symbol.svg'
import star from '../../assets/star.svg'
import { useToast } from '../../components/ToastProvider'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import BackButton from '../../components/BackButton'
import { initDataRaw } from '@telegram-apps/sdk-react'
import DefaultImage from '../../assets/defaultImage.png'

const ChannelDetails = () => {
    const navigate = useNavigate()
    const { addToast } = useToast()
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        productDetails,
        busyDay,
        loading,
        error,
        fetchProductDetails,
        fetchBusyDay,
        addToCart,
        formatNames,
    } = useProductStore()
    const { id } = useParams() // Получаем product_id из параметров URL
    const [selectedDates, setSelectedDates] = useState([]) // Хранит выбранные даты
    const [format, setFormat] = useState(searchParams.get('format'))
    const [post_time, setPostTime] = useState(() => {
        const time = searchParams.get('post_time')
        return time ? time.replace(' ', '+') : ''
    }) // Состояние для хранения выбранного времени

    useEffect(() => {
        fetchProductDetails(initDataRaw(), id) // Загружаем данные при первом рендере
        fetchBusyDay(initDataRaw(), id)
        // window.addEventListener('scroll', handleScroll)
        // return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchProductDetails, fetchBusyDay, id])

    const formatList = productDetails?.format_ids || []

    useEffect(() => {
        if (!format && formatList.length > 0) {
            setFormat(formatList[0]) // Берём первый доступный формат
        }
    }, [formatList, format])

    const handleFormatChange = (e) => {
        setFormat(e.target.value)
        // Устанавливаем выбранный формат
    }

    // Обработчик изменения времени
    const handlePostTimeChange = (e) => {
        const selectedTime = e.target.value // Получаем выбранное время
        setPostTime(selectedTime) // Обновляем состояние
        setSelectedDates([])
    }

    useEffect(() => {
        if (!post_time || selectedDates.length === 0) return

        const [hours, minutes] = post_time.split(':').map(Number)
        const now = new Date() // Текущее время

        // Берем первую выбранную дату (если их несколько, логика может быть сложнее)
        const selectedDate = selectedDates[0]

        const postDateTime = new Date(selectedDate)
        postDateTime.setHours(hours, minutes, 0, 0) // Устанавливаем время поста

        const timeDiff = (postDateTime - now) / (1000 * 60 * 60) // Разница в часах

        if (timeDiff < 3) {
            setPostTime('') // Сбрасываем время
        }
    }, [post_time, selectedDates])

    useEffect(() => {
        if (!productDetails) return

        // Проверка заполненности формы
        const isFormFilled = Boolean(
            selectedDates.length && post_time && format
        )

        // Обработчик клика
        const handleMainButtonClick = async () => {
            try {
                if (!productDetails) {
                    console.error('Детали продукта отсутствуют.')
                    return
                }

                await addToCart(initDataRaw(), {
                    product_id: productDetails.product_id,
                    quantity: selectedDates.length,
                    date: selectedDates,
                    post_time,
                    format,
                })

                // Сброс состояния
                setSelectedDates([])
                setPostTime('')
                setFormat('')
                hapticFeedback.notificationOccurred('success')
                // Перенаправление
                navigate('/basket')
            } catch (error) {
                const message =
                    error?.message ||
                    'Произошла ошибка при добавлении в корзину'
                console.error('Ошибка при добавлении в корзину:', error)
                addToast(message, 'error')
            }
        }
        // Установка параметров кнопки
        mainButton.setParams({
            text: `Купить за ${nanoTonToTon(productDetails.price * selectedDates.length)} Ton.`,
            backgroundColor: '#22C55E',
            textColor: '#ffffff',
            isVisible: isFormFilled,
            isEnabled: isFormFilled,
        })

        let unsubscribe

        if (mainButton.onClick.isAvailable()) {
            unsubscribe = mainButton.onClick(handleMainButtonClick)
        }

        // Очистка при размонтировании
        return () => {
            if (mainButton.setParams.isAvailable()) {
                mainButton.setParams({ isVisible: false })
            }

            if (typeof unsubscribe === 'function') {
                unsubscribe()
            }
        }
    }, [selectedDates, post_time, format, productDetails])

    const getBusyDays = () => {
        return busyDay.map((item) => new Date(item)) // Преобразуем каждую строку даты в объект Date
    }

    const tileDisabled = ({ date }) => {
        const busyDates = getBusyDays()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const isPast = date < today // Проверка на прошедшие даты

        // Проверяем, есть ли выбранное время среди занятых слотов для этой даты
        const isBusy = busyDates.some((busyDate) => {
            return (
                busyDate.getFullYear() === date.getFullYear() &&
                busyDate.getMonth() === date.getMonth() &&
                busyDate.getDate() === date.getDate() &&
                post_time && // Проверяем, что уже выбрано время
                busyDate.getHours() === Number(post_time.split(':')[0]) // Сравниваем часы
            )
        })

        // Если текущий день, проверяем разницу со временем поста
        if (date.toDateString() === today.toDateString() && post_time) {
            const [hours, minutes] = post_time.split(':').map(Number)
            const postDateTime = new Date()
            postDateTime.setHours(hours, minutes, 0, 0)

            const now = new Date() // Получаем текущее время
            const timeDiff = (postDateTime - now) / (1000 * 60 * 60) // Разница в часах

            if (timeDiff < 3) return true // Блокируем день
        }

        return isPast || isBusy
    }

    const handleDateChange = (date) => {
        // Преобразуем дату в строку без временной зоны (UTC)
        const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        )

        // Проверка на наличие даты в списке
        const isSelected = selectedDates.some(
            (selectedDate) =>
                selectedDate.getFullYear() === utcDate.getFullYear() &&
                selectedDate.getMonth() === utcDate.getMonth() &&
                selectedDate.getDate() === utcDate.getDate()
        )

        if (isSelected) {
            // Если дата уже выбрана, удаляем её из списка
            setSelectedDates(
                selectedDates.filter(
                    (selectedDate) =>
                        selectedDate.getTime() !== utcDate.getTime()
                )
            )
        } else {
            // Если дата не выбрана, добавляем её в список
            setSelectedDates([...selectedDates, utcDate])
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
            ? 'bg-accent-green bg'
            : isBusy
              ? 'bg-light-gray bg'
              : ''
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5 p-8 max-sm:gap-2">
            <BackButton></BackButton>
            <div className="bg-card-white flex flex-col justify-between rounded-xl">
                <div className="flex gap-6 py-2 px-6 w-full">
                    <div className="flex-shrink-0">
                        <img
                            className="rounded-full object-cover border-2 border-accent-green shadow-lg max-h-[111px] max-w-[111px]"
                            src={
                                `http://localhost:5000/channel_${productDetails.channel_tg_id}.png` ||
                                DefaultImage
                            }
                            alt={productDetails.channel_title}
                            style={{ aspectRatio: '1/1' }} // Сохранение пропорций изображения
                            onError={(e) => {
                                e.currentTarget.src = DefaultImage
                            }}
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <h3 className="text-xl font-extrabold text-main-green mb-4">
                            {productDetails.channel_title}
                        </h3>
                        <Link
                            to={`/user/${productDetails.user_uuid}`}
                            className="block text-lg text-blue mb-4 items-center"
                        >
                            <div className="flex gap-2">
                                <div className="flex">
                                    <p className=" text-xl px-1 max-sm:text-base">
                                        {productDetails.username}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src={star} alt="" />
                                    <p className=" text-xl max-sm:text-base">
                                        {productDetails.rating}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex gap-5 py-2 px-6 max-md:flex-col max-sm:gap-2">
                    <p className="text-base">
                        <span className="font-bold">Канал:</span>{' '}
                        {productDetails.channel_name}
                    </p>
                    <p className="text-base">
                        <span className="font-bold">Верифицирован:</span>{' '}
                        {productDetails.is_verified ? 'Да' : 'Нет'}
                    </p>
                    <p className="text-base">
                        <span className="font-bold">URL Канала:</span>{' '}
                        <a
                            href={productDetails.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue hover:underline"
                        >
                            {productDetails.channel_url}
                        </a>
                    </p>
                </div>
            </div>
            <div className="bg-card-white py-2 px-6 rounded-xl ">
                <p className="text-lg rounded-lg">
                    <span className="font-bold">Описание:</span>{' '}
                    {productDetails.description}
                </p>
            </div>
            <div className="flex bg-card-white py-2 px-6 rounded-xl">
                <div className="bg-blue flex items-center justify-between rounded-lg p-2">
                    <img src={Ton} alt="" className="h-[2em]" />
                    <p className="text-lg p-3 rounded-lg text-white">
                        {nanoTonToTon(productDetails.price)} Ton
                    </p>
                </div>
            </div>
            <div className="bg-card-white py-2 px-6 rounded-xl">
                <InfoBox product={productDetails} />
            </div>

            <div className="flex bg-card-white rounded-xl gap-4 py-2 px-6 max-sm:flex-col">
                {/* Выпадающий список для выбора формата */}
                <div className="basis-1/2">
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
                        className="w-full p-3 bg-background  rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-accent-green transition ease-in-out duration-200"
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
                <div className="basis-1/2">
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
                        className="w-full p-3 bg-background rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-accent-green transition ease-in-out duration-200"
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
            </div>

            {/* Блок с календарем */}
            <div className="bg-card-white p-2">
                <h3 className="text-2xl py-2 px-4">Выберите даты:</h3>
                <Calendar
                    onClickDay={handleDateChange} // Используем onClickDay для обработки кликов по дням
                    value={selectedDates} // Массив выбранных дат
                    tileDisabled={tileDisabled} // Делаем неактивными занятые дни
                    tileClassName={tileClassName} // Подсвечиваем выбранные и занятые дни
                    className="bg-dark-gray bg-white rounded-lg shadow-lg p-4"
                />
                <div>
                    <p className="text-lg py-5">Выбранные даты: </p>
                    <ul className="flex gap-3 justify-start flex-wrap items-center">
                        {selectedDates.map((date, index) => (
                            <li
                                key={index}
                                className="p-2 rounded-md flex justify-between gap-2 bg-white"
                            >
                                <p className="text-black">
                                    {date.toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ChannelDetails
