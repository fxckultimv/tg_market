import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Error from '../../Error'
import Document from '../../assets/create.svg'
import check from '../../assets/check.svg'

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
    console.log(publicationTime)

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
                publicationTimes &&
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
                        post_time: publicationTimes,
                    })
                    alert('Рекламное предложение успешно создано!')

                    // Очистка формы после успешного создания
                    setSelectedChannel(null)
                    setSelectedCategories(null)
                    setSelectedFormat([])
                    setAdFormat('')
                    setPublicationTime('')
                    setPublicationTimes('')
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

    // Функция для обработки клика по кнопке
    const handleButtonClick = (formatId) => {
        if (selectedFormat.includes(formatId)) {
            // Если формат уже выбран, убираем его из состояния
            setSelectedFormat(
                selectedFormat.filter((format) => format !== formatId)
            )
        } else {
            // Если формат не выбран, добавляем его в состояние
            setSelectedFormat([...selectedFormat, formatId])
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3 m-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img src={Document} alt="Документ" className="h-[32px]" />
                </div>
                <h1 className=" text-5xl text-center max-md:text-3xl">
                    Создать объявление
                </h1>
            </div>

            <div className="flex flex-col gap-6 mx-auto justify-center items-center w-[80%]">
                <div className="flex flex-col gap-6 min w-full">
                    {verifiedChannels.length > 0 ? (
                        <>
                            <div className="mb-6 bg-card-white p-6 rounded-xl">
                                <label
                                    htmlFor="channel-select"
                                    className="block mb-2"
                                >
                                    <p className="text-base">
                                        Выберите верифицированный канал:
                                    </p>
                                </label>
                                <select
                                    id="channel-select"
                                    className="w-full p-3 bg-medium-gray rounded"
                                    value={selectedChannel || ''}
                                    onChange={(e) =>
                                        setSelectedChannel(e.target.value)
                                    }
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
                                    <div className="mb-6 bg-card-white rounded-xl p-6">
                                        <label
                                            htmlFor="categories-select"
                                            className="block mb-2"
                                        >
                                            <p className="text-base">
                                                Выберите категорию:
                                            </p>
                                        </label>
                                        <select
                                            id="categories-select"
                                            className="w-full p-3 bg-white rounded"
                                            value={selectedCategories || ''}
                                            onChange={(e) => {
                                                setSelectedCategories(
                                                    e.target.value
                                                )
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
                                    <div className="bg-card-white rounded-xl p-6">
                                        <p className="text-base">
                                            Выберите типы публикации:
                                        </p>
                                        <div className="flex gap-2 p-6 flex-wrap">
                                            {formats.map((format) => (
                                                <button
                                                    key={format.format_id}
                                                    className={`flex gap-2 justify-between items-center px-4 py-2 rounded ${
                                                        selectedFormat.includes(
                                                            format.format_id
                                                        )
                                                            ? 'bg-blue bg'
                                                            : 'bg-white text-black'
                                                    }`}
                                                    onClick={() =>
                                                        handleButtonClick(
                                                            format.format_id
                                                        )
                                                    }
                                                >
                                                    {selectedFormat.includes(
                                                        format.format_id
                                                    ) && (
                                                        <img
                                                            src={check}
                                                            alt="Selected"
                                                            className="w-4 h-4"
                                                        />
                                                    )}
                                                    {format.format_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Описание */}
                                    <div className="bg-card-white p-6  rounded-xl">
                                        <label
                                            htmlFor="description"
                                            className="block text-base mb-2"
                                        >
                                            Введите описание рекламы:
                                        </label>
                                        <textarea
                                            id="description"
                                            className="w-full p-3rounded"
                                            placeholder="Введите описание до 256 символов"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    {console.log(publicationTimes)}
                                    <div className="flex justify-between bg-card-white p-6 rounded-xl gap-7 max-md:flex-col">
                                        {/* Выбор времени публикации */}
                                        <div className="flex flex-col gap-3 justify-start">
                                            <label
                                                htmlFor="publication-time"
                                                className="block text-base font-semibold"
                                            >
                                                Выберите время публикации:
                                            </label>
                                            {publicationTimes.map(
                                                (time, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center"
                                                    >
                                                        <input
                                                            type="time"
                                                            className="w-full p-3 rounded"
                                                            value={time}
                                                            onChange={(e) =>
                                                                handleTimeChange(
                                                                    e.target
                                                                        .value,
                                                                    index
                                                                )
                                                            }
                                                            onBlur={
                                                                handleCheckAvailability
                                                            }
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                removePublicationTime(
                                                                    index
                                                                )
                                                            }
                                                            className="ml-2 bg-red p-2 rounded"
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                            <div>
                                                <button
                                                    onClick={addPublicationTime}
                                                    className="px-4 py-2 rounded-md bg-green"
                                                >
                                                    <p className="text-base bg">
                                                        Добавить время
                                                    </p>
                                                </button>
                                            </div>

                                            {timeError && (
                                                <p className="text-red-500 mt-2">
                                                    {timeError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Установка цены */}
                                        <div className="mb-6 rounded-xl">
                                            <label
                                                htmlFor="price"
                                                className="block text-base font-semibold mb-2"
                                            >
                                                Установите цену за размещение:
                                            </label>
                                            <div className="flex justify-between items-center rounded-md border-2 bg-white border-gray">
                                                <p className="px-4 py-2 border-r-2 border-gray">
                                                    ₽
                                                </p>
                                                <input
                                                    id="price"
                                                    className="w-full px-4 py-2 rounded-md text-base focus:outline-none focus:ring-0 focus:border-transparent"
                                                    placeholder="Введите цену"
                                                    value={price}
                                                    onChange={(e) =>
                                                        setPrice(e.target.value)
                                                    }
                                                    style={{
                                                        appearance: 'textfield',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center bg-card-white">
                            <p className="text-lg mb-4">
                                У вас нет верифицированных каналов.
                            </p>
                            <p className="text-lg mb-8">
                                Для того чтобы создать рекламное предложение,
                                вам необходимо верифицировать ваш канал.
                            </p>
                            <Link
                                to="/verification-instructions"
                                className="rounded-full bg-blue-500 px-6 py-2 font-bold shadow-xl transition duration-300 hover:bg-blue-600"
                            >
                                Как верифицировать канал?
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CreateAd
