import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect, useState } from 'react'
import Loading from '../../../Loading'
import Error from '../../../Error'
import { useProductStore } from '../../../store'
import { useParams } from 'react-router-dom'
import SalesChart from './SalesChart'

const ChannelStats = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { id } = useParams()

    const {
        productDetails,
        order_stats,
        categories,
        loading,
        error,
        fetchProductDetails,
        updateProductDetails,
        fetchCategories,
        fetchOrderStats, // Функция для обновления
        deleteProduct, // Функция для удаления
    } = useProductStore()

    const [description, setDescription] = useState('')
    const [publicationTimes, setPublicationTimes] = useState([])
    const [selectedFormats, setSelectedFormats] = useState([])
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')

    console.log('description:', description)
    console.log('publicationTimes:', publicationTimes)
    console.log('selectedFormats:', selectedFormats)
    console.log('category:', category)
    console.log('price:', price)

    const availableFormats = [
        { format_id: 1, format_name: '1/24' },
        { format_id: 2, format_name: '2/48' },
        { format_id: 3, format_name: '3/72' },
        { format_id: 4, format_name: 'Indefinite' },
        { format_id: 5, format_name: 'Repost' },
        { format_id: 6, format_name: 'Response' },
    ]

    // Функция для приведения времени к формату "HH:MM"
    const formatTime = (time) => {
        return time.slice(0, 5) // Обрезаем секунды и часовой пояс, оставляем только "HH:MM"
    }

    useEffect(() => {
        if (productDetails) {
            setDescription(productDetails.description)
            setPublicationTimes(
                (productDetails.post_times || []).map(formatTime) // Преобразуем время с сервера в "HH:MM"
            )
            setSelectedFormats(productDetails.format_ids || [])
            setCategory(productDetails.category_id)
            setPrice(productDetails.price)
        }
    }, [productDetails])

    useEffect(() => {
        fetchProductDetails(initDataRaw, id)
        fetchCategories(initDataRaw)
        fetchOrderStats(initDataRaw, id)
    }, [initDataRaw, fetchProductDetails])

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

    const handleSave = async () => {
        const updatedDetails = {
            channel_id: productDetails.channel_id, // ID канала
            category_id: category,
            description,
            price,
            post_time: publicationTimes, // Массив с временем публикации
            format: selectedFormats, // Массив с форматами
        }

        try {
            const result = await updateProductDetails(
                initDataRaw,
                updatedDetails
            )
            if (result) {
                console.log('Изменения успешно сохранены!')
            } else {
                console.error('Ошибка при сохранении данных')
            }
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
            deleteProduct(id)
        }
    }

    // Обработчик для изменения выбранных форматов публикации
    const handleFormatChange = (event) => {
        const { value, checked } = event.target
        const formatId = parseInt(value)

        if (checked) {
            setSelectedFormats([...selectedFormats, formatId])
        } else {
            setSelectedFormats(selectedFormats.filter((id) => id !== formatId))
        }
    }

    // Обработчики для времени публикации
    const addPublicationTime = () => {
        setPublicationTimes([...publicationTimes, '12:00']) // Добавление нового времени по умолчанию
    }

    const removePublicationTime = (index) => {
        setPublicationTimes(publicationTimes.filter((_, i) => i !== index)) // Удаление времени по индексу
    }

    const handleTimeChange = (time, index) => {
        const newTimes = [...publicationTimes]
        newTimes[index] = time
        setPublicationTimes(newTimes)
    }

    const salesData = [
        { date: '2024-10-01', amount: 150 },
        { date: '2024-10-02', amount: 200 },
        { date: '2024-10-03', amount: 100 },
        { date: '2024-10-04', amount: 300 },
    ]

    console.log(order_stats)

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-extrabold text-main-green mb-8">
                Редактировать продукт:
            </h2>
            <h3 className="text-xl font-bold mb-2">{productDetails.title}</h3>
            <div className="flex-shrink-0">
                <img
                    className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                    src={`http://localhost:5000/channel_${productDetails.channel_tg_id}.png`}
                    alt={productDetails.channel_name}
                />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    // handleSave()
                }}
            >
                {/* Описание */}
                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Описание
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-medium-gray text-white border-main-gray"
                    />
                </div>

                {/* Выбор времени публикации */}
                <div className="mb-4">
                    <label
                        htmlFor="publication-times"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Время публикации
                    </label>
                    {publicationTimes.map((time, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="time"
                                className="w-full p-3 bg-medium-gray text-white rounded"
                                value={time}
                                onChange={(e) =>
                                    handleTimeChange(e.target.value, index)
                                }
                            />
                            <button
                                onClick={() => removePublicationTime(index)}
                                className="ml-2 bg-red-500 text-white p-2 rounded"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addPublicationTime}
                        className="mt-2 bg-accent-green text-white p-2 rounded"
                    >
                        Добавить время
                    </button>
                </div>

                {/* Выбор форматов публикации */}
                <div className="mb-4">
                    <label
                        htmlFor="formats"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Формат публикации
                    </label>
                    {availableFormats.map((format) => (
                        <div key={format.format_id} className="mb-2">
                            <label>
                                <input
                                    type="checkbox"
                                    value={format.format_id}
                                    checked={selectedFormats.includes(
                                        format.format_id
                                    )}
                                    onChange={handleFormatChange}
                                    className="mr-2"
                                />
                                {format.format_name}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Категория */}
                {/* <div className="mb-4">
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Категория
                    </label>
                    <input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-medium-gray text-white border-main-gray"
                    />
                </div> */}
                <div className="mb-6">
                    <label
                        htmlFor="categories-select"
                        className="block text-xl font-semibold mb-2"
                    >
                        Выберите категорию:
                    </label>
                    <select
                        id="categories-select"
                        className="w-full p-3 bg-medium-gray text-white rounded"
                        value={categories || ''}
                        onChange={(e) => {
                            setCategory(e.target.value)
                            console.log(e.target.value)
                        }}
                    >
                        <option value="" disabled>
                            -- Выберите категорию --
                        </option>
                        {categories.map((category) => (
                            <option
                                key={category.category_id}
                                value={category.category_id}
                            >
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Цена */}
                <div className="mb-4">
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-300"
                    >
                        Цена
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-medium-gray text-white border-main-gray"
                    />
                </div>

                {/* Кнопки */}
                <button
                    type="submit"
                    className="mt-4 bg-accent-green text-white px-4 py-2 rounded-md"
                    onClick={handleSave}
                >
                    Сохранить изменения
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md ml-4"
                >
                    Удалить продукт
                </button>
            </form>
            <SalesChart ordersData={order_stats} />
        </div>
    )
}

export default ChannelStats
