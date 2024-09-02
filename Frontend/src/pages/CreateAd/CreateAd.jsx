import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'

const CreateAd = () => {
    const { initDataRaw } = useLaunchParams()
    const mainButton = useMainButton()
    const {
        categories,
        verifiedChannels,
        fetchVerifiedChannels,
        fetchCategories,
        addProduct,
        loading,
        error,
    } = useUserStore()

    const [selectedChannel, setSelectedChannel] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState(null)
    const [adFormat, setAdFormat] = useState('')
    const [publicationTime, setPublicationTime] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [timeError, setTimeError] = useState('')

    useEffect(() => {
        fetchVerifiedChannels(initDataRaw)
        fetchCategories(initDataRaw)
    }, [initDataRaw, fetchVerifiedChannels, fetchCategories])

    // Обновление MainButton при изменении состояния полей
    useEffect(() => {
        if (mainButton) {
            const isFormFilled =
                selectedChannel &&
                selectedCategories &&
                adFormat &&
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
                        post_time: publicationTime,
                    })
                    alert('Рекламное предложение успешно создано!')

                    // Очистка формы после успешного создания
                    setSelectedChannel(null)
                    setSelectedCategories(null)
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
        adFormat,
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
            <h2 className="text-4xl font-bold text-green-400 mb-8">
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
                            <div className="mb-6">
                                <label
                                    htmlFor="ad-format"
                                    className="block text-xl font-semibold mb-2"
                                >
                                    Выберите формат размещения:
                                </label>
                                <select
                                    id="ad-format"
                                    className="w-full p-3 bg-gray-800 text-white rounded"
                                    value={adFormat}
                                    onChange={(e) =>
                                        setAdFormat(e.target.value)
                                    }
                                >
                                    <option value="" disabled>
                                        -- Выберите формат --
                                    </option>
                                    <option value="1/24">
                                        1/24 (1 публикация в течение 24 часов)
                                    </option>
                                    <option value="2/72">
                                        2/72 (2 публикации в течение 72 часов)
                                    </option>
                                </select>
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
                                <input
                                    type="datetime-local"
                                    id="publication-time"
                                    className="w-full p-3 bg-gray-800 text-white rounded"
                                    value={publicationTime}
                                    onChange={(e) =>
                                        setPublicationTime(e.target.value)
                                    }
                                    onBlur={handleCheckAvailability}
                                />
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
