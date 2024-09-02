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

    useEffect(() => {
        fetchProductDetails(initDataRaw, id) // Загружаем данные при первом рендере
        fetchBusyDay(initDataRaw, id)
    }, [fetchProductDetails, fetchBusyDay, initDataRaw, id])

    console.log(busyDay)

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
            if (selectedDates.length > 0) {
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
                    await addToCart(initDataRaw, {
                        product_id: productDetails.product_id,
                        quantity: selectedDates.length,
                        post_time: selectedDates,
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

    return (
        <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <h2 className="text-4xl font-bold text-green-400 mb-8">
                Детали Продукта
            </h2>
            <h3 className="text-2xl mb-4">{productDetails.title}</h3>
            <p className="text-lg">Описание: {productDetails.description}</p>
            <p className="text-lg">Цена: {productDetails.price} руб.</p>
            <p className="text-lg">
                Дата публикации:{' '}
                {new Date(productDetails.post_time).toLocaleDateString()}
            </p>
            <p className="text-lg">Канал: {productDetails.channel_name}</p>
            <p className="text-lg">
                Верифицирован: {productDetails.is_verified ? 'Да' : 'Нет'}
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
