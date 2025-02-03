import {
    useBackButton,
    useLaunchParams,
    useMainButton,
} from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import { useProductStore } from '../../store'
import { useParams } from 'react-router-dom'
import Calendar from 'react-calendar'
import './CalendarStyles.css'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Error from '../../Error'
import Loading from '../../Loading'
import InfoBox from '../../components/InfoBox'
import Ton from '../../assets/ton_symbol.svg'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'

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
        formatNames,
    } = useProductStore()
    const { id } = useParams() // Получаем product_id из параметров URL
    const [selectedDates, setSelectedDates] = useState([]) // Хранит выбранные даты
    const [format, setFormat] = useState()
    const [post_time, setPostTime] = useState('') // Состояние для хранения выбранного времени
    // const [postTimes, setPostTimes] = useState([]) // Состояние для хранения доступных времен

    useEffect(() => {
        fetchProductDetails(initDataRaw, id) // Загружаем данные при первом рендере
        fetchBusyDay(initDataRaw, id)
        // window.addEventListener('scroll', handleScroll)
        // return () => window.removeEventListener('scroll', handleScroll)
    }, [fetchProductDetails, fetchBusyDay, initDataRaw, id])

    const formatList = productDetails?.format_ids || []

    const handleFormatChange = (e) => {
        setFormat(e.target.value)
        // Устанавливаем выбранный формат
    }

    // Обработчик изменения времени
    const handlePostTimeChange = (e) => {
        const selectedTime = e.target.value // Получаем выбранное время
        setPostTime(selectedTime) // Обновляем состояние
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
        if (!productDetails) return

        // Проверка заполненности формы
        const isFormFilled = Boolean(
            selectedDates.length && post_time && format
        )

        // Установка параметров кнопки
        mainButton.setParams({
            text: `Купить за ${nanoTonToTon(productDetails.price * selectedDates.length)} Ton.`,
            backgroundColor: '#22C55E',
            textColor: '#ffffff',
            isVisible: isFormFilled,
            isEnabled: isFormFilled,
        })

        // Обработчик клика
        const handleMainButtonClick = async () => {
            try {
                if (!productDetails) {
                    console.error('Детали продукта отсутствуют.')
                    return
                }

                await addToCart(initDataRaw, {
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

                // Перенаправление
                navigate('/basket')
            } catch (error) {
                console.error('Ошибка при добавлении в корзину:', error)
            }
        }

        // Привязываем обработчик
        mainButton.on('click', handleMainButtonClick)

        // Очистка обработчика при размонтировании
        return () => {
            mainButton.off('click', handleMainButtonClick)
        }
    }, [
        initDataRaw,
        mainButton,
        selectedDates,
        post_time,
        format,
        productDetails,
    ])

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
        // Преобразуем дату в строку без временной зоны (UTC)
        const utcDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        )

        console.log(utcDate) // Дата в UTC

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
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5 p-8">
            <div className="bg-card-white flex flex-col justify-between">
                <div className="flex gap-6 p-8 w-full rounded-xl">
                    <div className="flex-shrink-0">
                        <img
                            className="rounded-full w-40 h-40 object-cover border-4 border-accent-green shadow-lg"
                            src={`/api/images/channel_${productDetails.channel_tg_id}.png`}
                            alt={productDetails.channel_title}
                            style={{ aspectRatio: '1/1' }} // Сохранение пропорций изображения
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <h3 className="text-3xl font-extrabold text-main-green mb-4">
                            {productDetails.channel_title}
                        </h3>
                        <Link
                            to={`/user/${productDetails.user_uuid}`}
                            className="block text-lg text-blue mb-4 items-center hover:font-bold"
                        >
                            @{productDetails.username} ⭐️{' '}
                            {productDetails.rating} (Рейтинг)
                        </Link>
                    </div>
                </div>
                <div className="flex gap-5 p-8 max-md:flex-col">
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
                            className="text-blue-500 hover:underline"
                        >
                            {productDetails.channel_url}
                        </a>
                    </p>
                </div>
            </div>
            <div className="bg-card-white p-8 rounded-xl ">
                <p className="text-lg mb-3 rounded-lg">
                    <span className="font-bold">Описание:</span>{' '}
                    {productDetails.description}
                </p>
            </div>
            <div className="flex bg-card-white p-8 rounded-xl">
                <div className="bg-blue flex items-center justify-between rounded-lg p-2">
                    <img src={Ton} alt="" className="h-[2em]" />
                    <p className="text-lg p-3 rounded-lg text-white">
                        {nanoTonToTon(productDetails.price)} Ton
                    </p>
                </div>
            </div>
            <div className="bg-card-white p-8">
                <InfoBox product={productDetails} />
            </div>

            <div className="flex bg-card-white rounded-xl gap-6 p-8 max-sm:flex-col">
                {/* Выпадающий список для выбора формата */}
                <div className="mb-6 basis-1/2">
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
            <div className="bg-card-white p-8">
                <h3 className="text-2xl p-4">Выберите даты</h3>
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
                                className="p-2 rounded-md flex justify-between gap-2 bg-white text-text"
                            >
                                <p>{date.toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ChannelDetails
