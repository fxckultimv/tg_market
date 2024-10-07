import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'

const CreateAd = () => {
    const { initDataRaw } = useLaunchParams()
    const mainButton = useMainButton()
    const {
        categories,
        formats,
        verifiedChannels,
        fetchVerifiedChannels,
        fetchCategories,
        fetchFormats,
        addProduct,
        loading,
        error,
    } = useUserStore()

    const [selectedChannel, setSelectedChannel] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState(null)
    const [selectedFormat, setSelectedFormat] = useState([])
    const [publicationTime, setPublicationTime] = useState('12:00')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [timeError, setTimeError] = useState('')
    const [publicationTimes, setPublicationTimes] = useState([])

    const addPublicationTime = () => {
        setPublicationTimes([...publicationTimes, '12:00']) // Добавление нового времени по умолчанию
    }

    const removePublicationTime = (index) => {
        setPublicationTimes(publicationTimes.filter((_, i) => i !== index)) // Удаление времени по индексу
    }

    const handleTimeChange = (time, index) => {
        let newTimes = [...publicationTimes]
        newTimes[index] = time
        setPublicationTimes(newTimes)
    }

    // const handleCheckAvailability = async () => {
    //     // Проверка доступности времени
    // }

    useEffect(() => {
        fetchVerifiedChannels(initDataRaw)
        fetchCategories(initDataRaw)
        fetchFormats(initDataRaw)
    }, [initDataRaw, fetchVerifiedChannels, fetchCategories, fetchFormats])

    // Обновление MainButton при изменении состояния полей
    useEffect(() => {
        if (mainButton) {
            const isFormFilled =
                selectedChannel &&
                selectedCategories &&
                selectedFormat &&
                publicationTime &&
                price &&
                description &&
                !timeError

            mainButton.setParams({
                text: `Создать предложение за ${price} руб.`,
                backgroundColor: '#22C55E',
                textColor: '#ffffff',
                isVisible: isFormFilled,
                isEnabled: isFormFilled,
            })

            const handleMainButtonClick = async () => {
                try {
                    await addProduct(initDataRaw, {
                        channel_id: selectedChannel,
                        category_id: selectedCategories,
                        description: description,
                        price: price,
                        format: selectedFormat,
                        post_time: publicationTime,
                    })
                    alert('Рекламное предложение успешно создано!')

                    // Очистка формы после успешного создания
                    setSelectedChannel(null)
                    setSelectedCategories(null)
                    setSelectedFormat([])
                    setAdFormat('')
                    setPublicationTime('')
                    setPrice('')
                    setDescription('')
                } catch (error) {
                    console.error(
                        'Ошибка при создании рекламного предложения:',
                        error
                    )
                    alert('Ошибка при создании рекламного предложения.')
                }
            }

            mainButton.on('click', handleMainButtonClick)

            // Cleanup при размонтировании
            return () => {
                mainButton.off('click', handleMainButtonClick)
            }
        }
    }, [
        mainButton,
        selectedChannel,
        selectedCategories,
        selectedFormat,
        publicationTime,
        price,
        description,
        timeError,
        initDataRaw,
        addProduct,
    ])

    const handleCheckAvailability = async () => {
        const isTimeAvailable = true
        if (!isTimeAvailable) {
            setTimeError(
                'Выбранное время занято, выберите другой временной слот.'
            )
        } else {
            setTimeError('')
        }
    }

    // Функция для обработки изменений чекбоксов
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target
        const formatId = parseInt(value) // Преобразование value в число

        if (checked) {
            // Если чекбокс выбран, добавляем его в состояние
            setSelectedFormat([...selectedFormat, formatId])
        } else {
            // Если чекбокс снят, удаляем его из состояния
            setSelectedFormat(
                selectedFormat.filter((format) => format !== formatId)
            )
        }
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

    return (
        <div className="container mx-auto p-6 min-h-screen bg-gray-900 text-white">
            <h2 className="text-2xl font-bold text-green-400 mb-8">
                Создать рекламное предложение
            </h2>

            {verifiedChannels.length > 0 ? (
                <>
                    <div className="mb-6">
                        <label
                            htmlFor="channel-select"
                            className="block text-xl font-semibold mb-2"
                        >
                            Выберите верифицированный канал:
                        </label>
                        <select
                            id="channel-select"
                            className="w-full p-3 bg-gray-800 text-white rounded"
                            value={selectedChannel || ''}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                        >
                            <option value="" disabled>
                                -- Выберите канал --
                            </option>
                            {verifiedChannels.map((channel) => (
                                <option
                                    key={channel.channel_id}
                                    value={channel.channel_id}
                                >
                                    {channel.channel_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedChannel && (
                        <>
                            {/* Выбор категории */}
                            <div className="mb-6">
                                <label
                                    htmlFor="categories-select"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Выберите категорию:
                                </label>
                                <select
                                    id="categories-select"
                                    className="w-full p-3 bg-gray-800 text-white rounded"
                                    value={selectedCategories || ''}
                                    onChange={(e) => {
                                        setSelectedCategories(e.target.value)
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

                            {/* Выбор формата размещения */}
                            <div>
                                <h3>Выберите типы публикации:</h3>
                                {formats.map((format) => (
                                    <div key={format.format_id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={format.format_id}
                                                checked={selectedFormat.includes(
                                                    format.format_id
                                                )}
                                                onChange={handleCheckboxChange}
                                            />
                                            {format.format_name}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Описание */}
                            <div className="mb-6">
                                <label
                                    htmlFor="description"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Введите описание рекламы:
                                </label>
                                <textarea
                                    id="description"
                                    className="w-full p-3 bg-gray-800 text-white rounded"
                                    placeholder="Введите описание рекламы"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows="4"
                                ></textarea>
                            </div>

                            {/* Выбор времени публикации */}
                            <div className="mb-6">
                                <label
                                    htmlFor="publication-time"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Выберите время публикации:
                                </label>
                                {publicationTimes.map((time, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center mb-2"
                                    >
                                        <input
                                            type="time"
                                            className="w-full p-3 bg-gray-800 text-white rounded"
                                            value={time}
                                            onChange={(e) =>
                                                handleTimeChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            onBlur={handleCheckAvailability}
                                        />
                                        <button
                                            onClick={() =>
                                                removePublicationTime(index)
                                            }
                                            className="ml-2 bg-red-500 text-white p-2 rounded"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addPublicationTime}
                                    className="mt-2 bg-green-500 text-white p-2 rounded"
                                >
                                    Добавить время
                                </button>
                                {timeError && (
                                    <p className="text-red-500 mt-2">
                                        {timeError}
                                    </p>
                                )}
                            </div>

                            {/* Установка цены */}
                            <div className="mb-6">
                                <label
                                    htmlFor="price"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Установите цену за размещение:
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    className="w-full p-3 bg-gray-800 text-white rounded"
                                    placeholder="Введите цену"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    style={{ appearance: 'textfield' }}
                                />
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="text-center">
                    <p className="text-lg mb-4">
                        У вас нет верифицированных каналов.
                    </p>
                    <p className="text-lg mb-8">
                        Для того чтобы создать рекламное предложение, вам
                        необходимо верифицировать ваш канал.
                    </p>
                    <Link
                        to="/verification-instructions"
                        className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white shadow-xl transition duration-300 hover:bg-blue-600"
                    >
                        Как верифицировать канал?
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CreateAd
