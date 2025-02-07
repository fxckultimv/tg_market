import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../store'
import { useLaunchParams, useMainButton } from '@tma.js/sdk-react'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Error from '../../Error'
import Document from '../../assets/create.svg'
import check from '../../assets/check.svg'
import ArrowLeft from '../../assets/arrow-left.svg'
import ArrowRight from '../../assets/arrow-right.svg'
import Check from '../../assets/check-contained.svg'
import { useRef } from 'react'
import { useToast } from '../../components/ToastProvider'

const CreateAd = () => {
    const { initDataRaw } = useLaunchParams()
    const mainButton = useMainButton()
    const { addToast } = useToast()
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
                selectedFormat.length > 0 &&
                publicationTimes.length > 0 &&
                price >= 0.1 &&
                description &&
                !timeError

            mainButton.setParams({
                text: `Создать предложение за ${price} Ton.`,
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
                        price: tonToNanoTon(price),
                        format: selectedFormat,
                        post_time: publicationTimes,
                    })
                    addToast('Рекламное предложение успешно создано!')

                    // Очистка формы после успешного создания
                    setSelectedChannel(null)
                    setSelectedCategories(null)
                    setSelectedFormat([])
                    setPublicationTime('')
                    setPublicationTimes('')
                    setPrice('')
                    setDescription('')
                } catch (error) {
                    console.error(
                        'Ошибка при создании рекламного предложения:',
                        error
                    )
                    addToast(
                        'Ошибка при создании рекламного предложения.',
                        'error'
                    )
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
        publicationTimes,
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

    const sliderRef = useRef(null)

    const handleSelectChannel = (channelId) => {
        if (channelId != selectedChannel) {
            setSelectedChannel(channelId)
        } else setSelectedChannel(null)
    }

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -150, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 150, behavior: 'smooth' })
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
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <p className="text-base">
                                            Выберите верифицированный канал:
                                        </p>
                                        <div className="flex gap-3">
                                            <button onClick={scrollLeft}>
                                                <img
                                                    src={ArrowLeft}
                                                    alt="Left Arrow"
                                                />
                                            </button>
                                            <button onClick={scrollRight}>
                                                <img
                                                    src={ArrowRight}
                                                    alt="Right Arrow"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        ref={sliderRef}
                                        className="flex overflow-x-scroll py-3 snap-x -scroll-m-3 gap-3"
                                    >
                                        {verifiedChannels.map((channel) => (
                                            <div
                                                key={channel.channel_id}
                                                onClick={() =>
                                                    handleSelectChannel(
                                                        channel.channel_id
                                                    )
                                                }
                                                className={` rounded-3xl flex flex-col gap-3 items-center p-4 cursor-pointer w-[150px] h-[200px] select-none scroll-mr-3 ${
                                                    selectedChannel ===
                                                    channel.channel_id
                                                        ? 'bg-blue text-white'
                                                        : 'bg-background'
                                                } ${channel.has_product ? 'opacity-50 pointer-events-none' : ''}`} //Скрытие каналов для котрых есть продукты
                                            >
                                                <div className="relative">
                                                    {' '}
                                                    <img
                                                        src={`/api/images/channel_${channel.channel_tg_id}.png`}
                                                        alt=""
                                                        className="rounded-full h-[82px]"
                                                    />
                                                    {selectedChannel ===
                                                        channel.channel_id && (
                                                        <img
                                                            src={Check}
                                                            alt=""
                                                            className="absolute right-0 top-0 bg-blue rounded-full"
                                                        />
                                                    )}
                                                </div>

                                                <p className="mt-2">
                                                    {channel.channel_name}
                                                </p>
                                                {/* <div className="flex gap-2 items-center mt-1">
                                                    <p>4.8</p>
                                                    <img
                                                        src={Star}
                                                        alt="Star Icon"
                                                    />
                                                </div> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

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
                                    className="w-full p-3 bg-info-box rounded"
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
                            <div className="bg-card-white rounded-xl p-6">
                                <p className="text-base">
                                    Выберите формат публикации:
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
                                    className="w-full p-3 rounded bg-info-box"
                                    placeholder="Введите описание до 256 символов"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows="4"
                                ></textarea>
                            </div>
                            <div className="flex justify-between bg-card-white p-6 rounded-xl gap-7 max-md:flex-col">
                                {/* Выбор времени публикации */}
                                <div className="flex flex-col gap-3 justify-start">
                                    <label
                                        htmlFor="publication-time"
                                        className="block text-base font-semibold"
                                    >
                                        Выберите время публикации:
                                    </label>
                                    {publicationTimes.map((time, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="time"
                                                className="w-full p-3 rounded  text-black"
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
                                                className="ml-2 bg-red p-2 rounded"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    ))}
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

                                    <div className="flex justify-between items-center rounded-md border-2 bg-info-box border-gray">
                                        {/* <p className="px-4 py-2 border-r-2 border-gray">
                                            ₽
                                        </p> */}
                                        <img
                                            src={Ton}
                                            alt=""
                                            className="px-2 h-6 border-r-2 border-gray"
                                        />
                                        <input
                                            id="price"
                                            className="bg-info-box w-full px-4 py-2 rounded-md text-base focus:outline-none focus:ring-0 focus:border-transparent"
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
