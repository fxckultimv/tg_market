import { useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect } from 'react'
import { useUserStore } from '../../store'
import Error from '../../Error'
import Loading from '../../Loading'
import Ellipse from '../../assets/Ellipse.svg'
import bigLogo from '../../assets/bigLogo.svg'
import banner from '../../assets/banner.svg'
import duck1 from '../../assets/duck1.gif'
import duck2 from '../../assets/duck2.gif'
import time from '../../assets/time.gif'
import Arrow2 from '../../assets/Arrow2.svg'
import phone from '../../assets/phone.svg'
import star from '../../assets/star.svg'
import topor from '../../assets/topor.png'
import arrowDown from '../../assets/chevron-down.svg'
import user from '../../assets/subscribers.svg'
import view from '../../assets/view.svg'
import Arrow from '../../assets/Arrow.svg'
import tg from '../../assets/tg.svg'
import Logo from '../../assets/logo.svg'
import Name from '../../assets/TeleAdMarket.svg'
import lucky from '../../assets/lucky.svg'
import Ton from '../../assets/ton_symbol.svg'
import Cat from '../../assets/cat-home.svg'
import Money from '../../assets/money-dollar.svg'
import Clover from '../../assets/clover.svg'
import BankHome from '../../assets/bank-home.svg'
import { motion } from 'framer-motion'
import Rectangle from '../../assets/phones/Rectangle 24.png'
import Cellular from '../../assets/phones/Cellular.svg'
import Wifi from '../../assets/phones/WiFi.svg'
import Battery from '../../assets/phones/Battery.svg'
import Shape from '../../assets/phones/Shape.svg'
import B from '../../assets/phones/B.png'
import Topor from '../../assets/phones/topor.png'
import Bull from '../../assets/phones/bull.png'
import Scr1 from '../../assets/phones/scr1.png'
import Scr2 from '../../assets/phones/scr2.png'
import Scr3 from '../../assets/phones/scr3.png'
import Scr4 from '../../assets/phones/scr4.png'
import Scr5 from '../../assets/phones/scr5.png'
import Scr6 from '../../assets/phones/scr6.png'

const Home = () => {
    const { initDataRaw } = useLaunchParams()
    const { fetchAuth, loading, error } = useUserStore()

    useEffect(() => {
        fetchAuth(initDataRaw)
    }, [initDataRaw, fetchAuth])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    // Фейковая статистика
    const fakeStats = {
        totalChannels: 15000,
        totalAdvertisers: 3200,
        adsPlaced: 67000,
        revenueGenerated: 1000000,
    }

    return (
        <>
            <div className="flex flex-col items-center text-center py-10">
                <div className="relative w-full h-[300px] flex justify-center items-center">
                    {/* Фон или неподвижный элемент */}
                    <img
                        src={Ellipse}
                        alt="Background"
                        className="absolute top-0 z-0"
                    />

                    {/* Центральный логотип */}
                    <img
                        src={bigLogo}
                        alt="Main logo"
                        className="relative w-[147px] h-[147px] drop-shadow-[0_0_25px_blue] z-10"
                    />

                    {/* Анимированный контейнер для вращения элементов */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        {/* Пример набора элементов с абсолютным позиционированием */}
                        {/* Элемент 1 – всегда виден */}
                        <div className="absolute top-[5%] left-[10%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Cat"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 2 – показываем только на экранах от md и выше */}
                        <div className="hidden md:block absolute top-[10%] right-[10%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img2"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 3 – всегда виден */}
                        <div className="absolute bottom-[15%] right-[15%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img3"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 4 – показываем только на lg и выше */}
                        <div className="hidden lg:block absolute bottom-[10%] left-[15%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img4"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 5 – всегда виден */}
                        <div className="absolute top-[30%] left-[5%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img5"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 6 – показываем только на md и выше */}
                        <div className="hidden md:block absolute top-[40%] right-[5%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img6"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 7 – всегда виден */}
                        <div className="absolute bottom-[25%] left-[25%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img7"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Элемент 8 – показываем только на lg и выше */}
                        <div className="hidden lg:block absolute bottom-[20%] right-[25%] w-16 md:w-20 aspect-square flex items-center justify-center">
                            <img
                                src={Cat}
                                alt="Img8"
                                className="w-full h-auto"
                            />
                        </div>
                    </motion.div>

                    {/* Градиентный оверлей снизу для плавного исчезновения элементов */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none
                   bg-gradient-to-t from-gray-100 to-transparent z-20"
                    />
                </div>
                <div className="relative w-full h-[300px] flex justify-center items-center">
                    <img
                        src={Ellipse}
                        alt="Background"
                        className="absolute top-0 z-0"
                    />

                    {/* Центральный логотип */}
                    <img
                        src={bigLogo}
                        alt="Main logo"
                        className="relative w-[147px] h-[147px] drop-shadow-[0_0_25px_blue] z-10"
                    />
                </div>
                <h1 className="text-4xl font-bold mt-8 z-10">
                    TeleAdMarket — это продвижение в{' '}
                    <span className="text-blue">Telegram</span>
                </h1>

                {/* Подзаголовок */}
                <p className="text-gray-600 mt-4 max-md:text-xs">
                    Наше приложение помогает покупать рекламу в Telegram-каналах
                    и автоматизировать процесс её продажи.
                </p>
            </div>
            <div className="flex flex-row gap-8 m-6 max-md:flex-col">
                {/* Левая секция с баннером */}
                <div className="basis-2/3 relative bg-gradient-radial from-white to-main-gray p-8 rounded-3xl border-2">
                    <h1 className="text-4xl font-semibold mb-4">
                        Мы разместили...
                    </h1>
                    <p className="text-md mb-8 text-gray-600 z-10">
                        Мы разместили огромное количество объявлений по рекламе
                    </p>
                    <img
                        src={banner}
                        alt="Баннер"
                        className="absolute top-1/2 transform -translate-y-1/4 right-8 w-3/4 z-0 max-md:right-2"
                    />
                </div>

                {/* Правая секция с изображением и текстом */}
                <div className="basis-1/3 bg-gradient-radial from-white to-main-gray  p-8 rounded-3xl flex flex-col items-center border-2">
                    <img src={duck1} alt="Рекламодатель" className=" mb-4" />
                    <h1 className="text-3xl font-semibold mb-2">
                        Рекламодатели
                    </h1>
                    <p className="text-md text-gray-600 text-center">
                        На нашей платформе огромное количество рекламодателей
                    </p>
                </div>
            </div>

            <div className="flex flex-row gap-8 m-6 max-md:flex-col">
                <div className="basis-1/3 bg-gradient-radial from-white to-main-gray p-8 rounded-3xl flex flex-col items-center border-2">
                    <div className="flex-1 flex justify-center items-center">
                        <img
                            src={duck2}
                            alt=""
                            className="mb-4 max-h-[360px] object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-semibold mb-2">Каналы</h1>
                    <p className="text-md text-gray-600 text-center">
                        На нашей платформе огромное количество рекламодателей
                    </p>
                </div>
                <div className="basis-2/3 bg-gradient-radial border-2 p-8 rounded-3xl flex flex-col items-center">
                    <div className="flex-1 flex justify-center items-center">
                        <img
                            src={time}
                            alt=""
                            className="mb-4 max-h-[360px] object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-semibold mb-2">
                        Экономия времени и усилий
                    </h1>
                    <p className="break-words whitespace-normal text-sm text-gray-600 text-center">
                        С нами вам не нужно тратить часы на поиск каналов и
                        настройку рекламы. Мы подберем подходящие площадки и
                        организуем эффективное продвижение для вашего бизнеса.
                    </p>
                </div>
            </div>

            <div className="m-6 mt-10">
                <h2 className="text-5xl font-semibold mb-6">
                    Популярные категории
                </h2>
                <div className="flex gap-8 items-center overflow-x-auto">
                    <div className="flex-grow bg-phone-blue rounded-3xl items-center flex flex-col px-[38px] py-[70px]">
                        <div className="w-full flex justify-between">
                            <h2 className="text-white text-2xl">Бизнес</h2>{' '}
                            <img src={Arrow2} alt="" />
                        </div>
                        <div className="relative w-[349px] h-[547px] overflow-hidde">
                            {/* Фон */}
                            <img
                                src={Rectangle}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Контент */}
                            <div className="relative z-10 p-4 text-white">
                                <div className="flex justify-between items-center p-7">
                                    <p className="text-white">9:41</p>
                                    <div className="flex gap-2">
                                        <img src={Cellular} alt="" />
                                        <img src={Wifi} alt="" />
                                        <img src={Battery} alt="" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-5 ">
                                    {/* Левая иконка */}
                                    <img src={Shape} alt="" />

                                    {/* Текстовый блок - занимает всю доступную ширину */}
                                    <div className="flex-1 flex flex-col items-center text-center">
                                        <h2 className="text-base font-bold">
                                            Интернет магазин
                                        </h2>
                                        <p className="text-xs text-gray-300">
                                            60 600 подписчиков
                                        </p>
                                    </div>
                                    <img
                                        src={B}
                                        alt=""
                                        className="max-h-[35px] max-w-[35px]"
                                    />
                                </div>
                                <div className="relative overflow-hidden px-5 object-cover">
                                    <img
                                        src={Scr1}
                                        alt=""
                                        className=""
                                        style={{
                                            maskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                            WebkitMaskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                        }}
                                    />
                                    <img
                                        src={Scr2}
                                        alt=""
                                        className=""
                                        style={{
                                            maxHeight: '159px',
                                            overflow: 'hidden',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow bg-dark-blue rounded-3xl items-center flex flex-col px-[38px] py-[70px]">
                        <div className="w-full flex justify-between">
                            <h2 className="text-white text-2xl">
                                Развлекательные каналы
                            </h2>{' '}
                            <img src={Arrow2} alt="" />
                        </div>
                        <div className="relative w-[349px] h-[547px] overflow-hidde">
                            {/* Фон */}
                            <img
                                src={Rectangle}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Контент */}
                            <div className="relative z-10 p-4 text-white">
                                <div className="flex justify-between items-center p-7">
                                    <p className="text-white">9:41</p>
                                    <div className="flex gap-2">
                                        <img src={Cellular} alt="" />
                                        <img src={Wifi} alt="" />
                                        <img src={Battery} alt="" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-5 ">
                                    {/* Левая иконка */}
                                    <img src={Shape} alt="" />

                                    {/* Текстовый блок - занимает всю доступную ширину */}
                                    <div className="flex-1 flex flex-col items-center text-center">
                                        <h2 className="text-base font-bold">
                                            Новости
                                        </h2>
                                        <p className="text-xs text-gray-300">
                                            4 123 432 подписчиков
                                        </p>
                                    </div>
                                    <img
                                        src={Topor}
                                        alt=""
                                        className="max-h-[35px] max-w-[35px]"
                                    />
                                </div>
                                <div className="relative overflow-hidden px-5 object-cover">
                                    <img
                                        src={Scr3}
                                        alt=""
                                        className=""
                                        style={{
                                            maskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                            WebkitMaskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                        }}
                                    />
                                    <img
                                        src={Scr4}
                                        alt=""
                                        className=""
                                        style={{
                                            maxHeight: '159px',
                                            overflow: 'hidden',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow bg-phone-blue rounded-3xl items-center flex flex-col px-[38px] py-[70px]">
                        <div className="w-full flex justify-between">
                            <h2 className="text-white text-2xl">
                                Новости и медиа
                            </h2>{' '}
                            <img src={Arrow2} alt="" />
                        </div>
                        <div className="relative w-[349px] h-[547px] overflow-hidde">
                            {/* Фон */}
                            <img
                                src={Rectangle}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Контент */}
                            <div className="relative z-10 p-4 text-white">
                                <div className="flex justify-between items-center p-7">
                                    <p className="text-white">9:41</p>
                                    <div className="flex gap-2">
                                        <img src={Cellular} alt="" />
                                        <img src={Wifi} alt="" />
                                        <img src={Battery} alt="" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-5 ">
                                    {/* Левая иконка */}
                                    <img src={Shape} alt="" />

                                    {/* Текстовый блок - занимает всю доступную ширину */}
                                    <div className="flex-1 flex flex-col items-center text-center">
                                        <h2 className="text-base font-bold">
                                            Инвестиции
                                        </h2>
                                        <p className="text-xs text-gray-300">
                                            45 839 подписчиков
                                        </p>
                                    </div>
                                    <img
                                        src={Bull}
                                        alt=""
                                        className="max-h-[35px] max-w-[35px]"
                                    />
                                </div>
                                <div className="relative overflow-hidden px-5 object-cover">
                                    <img
                                        src={Scr5}
                                        alt=""
                                        className=""
                                        style={{
                                            maskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                            WebkitMaskImage:
                                                'linear-gradient(to top, rgba(0,0,0,1) 70%, rgba(0,0,0,0))',
                                        }}
                                    />
                                    <img
                                        src={Scr6}
                                        alt=""
                                        className=""
                                        style={{
                                            maxHeight: '208px',
                                            overflow: 'hidden',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-dark-blue max-md:rounded-2xl">
                <div className="flex flex-col items-center justify-center pt-20 p-4">
                    <h2 className="text-5xl text-white mb-5 max-md:text-3xl text-center">
                        Рекомендованные объявления
                    </h2>{' '}
                    <p className="text-xl text-gray max-md:text-base text-center">
                        лучшие объявления с короткими описаниями и ссылками для
                        быстрого перехода.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <div className="flex m-8 gap-4 flex-col md:flex-row">
                        <div className="bg-main-blue basis-1/3 p-8 rounded-3xl">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-white text-2xl">
                                        Топор+
                                    </h2>
                                    <div className="flex gap-2">
                                        <img src={star} alt="" />
                                        <p className="text-white text-xl">
                                            4.8
                                        </p>
                                    </div>
                                    <p className="text-white text-sm border-2 border-gray rounded-full px-4">
                                        Новости и медиа
                                    </p>
                                </div>
                                <div className="aspect-square">
                                    <img src={topor} alt="" />
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <p className="text-white mb-3">Время публикации:</p>
                            <div className="flex justify-between gap-4">
                                <div className="flex justify-between flex-grow p-3 border-2 rounded-xl border-gray">
                                    <p className="text-white">1/24</p>
                                    <img src={arrowDown} alt="" />
                                </div>

                                <div className="flex justify-between p-3 flex-grow border-2 rounded-xl border-gray">
                                    <p className="text-white">12:00</p>
                                    <img src={arrowDown} alt="" />
                                </div>
                            </div>

                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div>
                                <p className="text-white p-2">Статистика</p>
                                <div className="flex justify-between gap-3 text-nowrap ">
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={user}
                                            alt=""
                                            className="max-h-[24px]"
                                        />
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            4
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={view}
                                            alt=""
                                            className="max-h-[24px]"
                                        />
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:text-xs max-md:px-3">
                                        <p className="text-white">ER</p>
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            233.33%
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <p className="text-white max-md:text-xs">
                                            CPV
                                        </p>
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44 ₽
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-white text-sm">
                                        Стоимость
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={Ton}
                                            alt=""
                                            className="max-h-[30px] w-auto inline-block align-middle"
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                        <p className="text-white text-3xl max-md:text-base">
                                            45 Ton
                                        </p>
                                    </div>
                                </div>
                                <div className=" flex justify-between bg-blue  rounded-2xl items-center">
                                    <a
                                        href=""
                                        className=" p-3 text-xl text-white gap-3 flex max-md:text-base max-md:gap-1 max-md:p-1"
                                    >
                                        <img src={Arrow} alt="" />
                                        Начать сейчас
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-main-blue basis-1/3 p-8 rounded-3xl">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-white text-2xl">
                                        Топор+
                                    </h2>
                                    <div className="flex gap-2">
                                        <img src={star} alt="" />
                                        <p className="text-white text-xl">
                                            4.8
                                        </p>
                                    </div>
                                    <p className="text-white text-sm border-2 border-gray rounded-full px-4">
                                        Новости и медиа
                                    </p>
                                </div>
                                <div className="aspect-square">
                                    <img src={topor} alt="" />
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <p className="text-white mb-3">Время публикации:</p>
                            <div className="flex justify-between gap-4">
                                <div className="flex justify-between flex-grow p-3 border-2 rounded-xl border-gray">
                                    <p className="text-white">1/24</p>
                                    <img src={arrowDown} alt="" />
                                </div>

                                <div className="flex justify-between p-3 flex-grow border-2 rounded-xl border-gray">
                                    <p className="text-white">12:00</p>
                                    <img src={arrowDown} alt="" />
                                </div>
                            </div>

                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div>
                                <p className="text-white p-2">Статистика</p>
                                <div className="flex justify-between gap-3 text-nowrap">
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={user}
                                            alt=""
                                            className="min-h-[24px]"
                                        />
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            4
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={view}
                                            alt=""
                                            className="min-h-[24px]"
                                        />
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <h2 className="text-white max-md:text-xs">
                                            ER
                                        </h2>
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            233.33%
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <h2 className="text-white max-md:text-xs">
                                            CPV
                                        </h2>
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44 ₽
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-white text-sm">
                                        Стоимость
                                    </p>
                                    <h2 className="text-white text-3xl">
                                        4500 ₽
                                    </h2>
                                </div>
                                <div className="bg-blue  rounded-2xl items-center ">
                                    <a
                                        href=""
                                        className=" p-3 text-xl  text-white gap-3 flex"
                                    >
                                        <img src={Arrow} alt="" />
                                        Начать сейчас
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="bg-main-blue basis-1/3 p-8 rounded-3xl">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-white text-2xl">
                                        Топор+
                                    </h2>
                                    <div className="flex gap-2">
                                        <img src={star} alt="" />
                                        <p className="text-white text-xl">
                                            4.8
                                        </p>
                                    </div>
                                    <p className="text-white text-sm border-2 border-gray rounded-full px-4">
                                        Новости и медиа
                                    </p>
                                </div>
                                <div className="aspect-square">
                                    <img src={topor} alt="" />
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <p className="text-white mb-3">Время публикации:</p>
                            <div className="flex justify-between gap-4">
                                <div className="flex justify-between flex-grow p-3 border-2 rounded-xl border-gray">
                                    <p className="text-white">1/24</p>
                                    <img src={arrowDown} alt="" />
                                </div>

                                <div className="flex justify-between p-3 flex-grow border-2 rounded-xl border-gray">
                                    <p className="text-white">12:00</p>
                                    <img src={arrowDown} alt="" />
                                </div>
                            </div>

                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div>
                                <p className="text-white p-2">Статистика</p>
                                <div className="flex justify-between gap-3 text-nowrap">
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={user}
                                            alt=""
                                            className="min-h-[24px]"
                                        />
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            4
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <img
                                            src={view}
                                            alt=""
                                            className="min-h-[24px]"
                                        />
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <h2 className="text-white max-md:text-xs">
                                            ER
                                        </h2>
                                        <p className="bg-blue text-white text-sm p-1 rounded max-md:text-xs">
                                            233.33%
                                        </p>
                                    </div>
                                    <div className="bg-dark-blue flex flex-col justify-center items-center px-6 py-2 rounded-xl gap-2 max-md:px-3">
                                        <h2 className="text-white max-md:text-xs">
                                            CPV
                                        </h2>
                                        <p className="bg-blue text-white  text-sm p-1 rounded max-md:text-xs">
                                            44 ₽
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray w-full h-[1px] my-8"></div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-white text-sm">
                                        Стоимость
                                    </p>
                                    <h2 className="text-white text-3xl">
                                        10 $
                                    </h2>
                                </div>
                                <div className="bg-blue  rounded-2xl items-center ">
                                    <a
                                        href=""
                                        className=" p-3 text-xl  text-white gap-3 flex"
                                    >
                                        <img src={Arrow} alt="" />
                                        Начать сейчас
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-16 py-20 bg-background">
                    <h1 className="text-5xl">Часто задаваемые вопросы</h1>
                    <div className="flex flex-col gap-6 mt-8">
                        <div className="px-5 py-8 bg-blue rounded-3xl">
                            <h2 className="text-xl text-white mb-5">
                                Как быстро я увижу результаты своего объявления?
                            </h2>{' '}
                            <p className="text-base bg text-white">
                                Результаты могут варьироваться в зависимости от
                                категории и бюджета, но большинство
                                пользователей отмечают первые результаты уже в
                                течение 24-48 часов после публикации.
                            </p>
                        </div>
                        <div className="px-5 py-8 bg-cardGradient rounded-3xl">
                            <h2 className="text-xl text-black mb-5">
                                Можно ли отслеживать эффективность рекламной
                                кампании?
                            </h2>{' '}
                        </div>
                        <div className="px-5 py-8 bg-cardGradient rounded-3xl">
                            <h2 className="text-xl text-black mb-5">
                                Как выбрать подходящие каналы для продвижения?
                            </h2>{' '}
                        </div>
                        <div className="px-5 py-8 bg-cardGradient rounded-3xl">
                            <h2 className="text-xl text-black mb-5">
                                Есть ли ограничения по количеству объявлений?
                            </h2>{' '}
                        </div>
                        <div className="px-5 py-8 bg-cardGradient rounded-3xl">
                            <h2 className="text-xl text-black mb-5">
                                Как я могу изменить или удалить свое объявление?
                            </h2>{' '}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center py-10 relative bg-background">
                    {/* Фоновое изображение */}
                    <img
                        src={Ellipse}
                        alt="Background2"
                        className="absolute bottom-20 z-0 rotate-180"
                    />
                    {/* Иконки вокруг
                <div className="absolute -top-10 left-10 w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <img src={iconPhone} alt="Phone" className="w-10 h-10" />
                </div>
                <div className="absolute -top-10 right-10 w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <img src={iconLaptop} alt="Laptop" className="w-10 h-10" />
                </div>
                <div className="absolute bottom-20 left-20 w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <img src={iconBox} alt="Box" className="w-10 h-10" />
                </div>
                <div className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <img
                        src={iconPhoneApp}
                        alt="Phone App"
                        className="w-10 h-10"
                    />
                </div> */}
                    {/* Контент */}
                    <div className="z-10 mt-20 flex flex-col items-center">
                        <h1 className="text-4xl font-bold mt-8 z-10">
                            Связаться с нами
                        </h1>
                        <p className="mt-4 max-w-2xl text-center">
                            У вас есть вопросы или вы хотите обсудить детали
                            продвижения? Мы готовы помочь!
                        </p>

                        {/* Кнопка */}
                        <div className="mt-6">
                            <button className="bg-blue text-white py-3 px-6 rounded-xl flex items-center gap-2">
                                <img
                                    src={tg}
                                    alt="Telegram"
                                    className="w-5 h-5"
                                />
                                <span>Перейти в телеграм</span>
                            </button>
                        </div>
                        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
                            <div className="absolute top-[5%] left-[5%] sm:left-[10%] md:left-[20%] w-1/4 max-w-[80px] lg:max-w-[100px] aspect-square bg-white rounded-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl rotate-45">
                                📞
                            </div>
                            <div className="absolute top-[5%] right-[5%] sm:right-[10%] md:right-[20%] w-1/4 max-w-[80px] lg:max-w-[100px] aspect-square bg-white rounded-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl rotate-45">
                                💻
                            </div>
                            <div className="absolute -rotate-30 bottom-[5%] right-[5%] sm:right-[10%] md:right-[25%] w-1/4 max-w-[80px] lg:max-w-[100px] aspect-square bg-white rounded-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl">
                                📦
                            </div>
                            <div className="absolute bottom-[5%] left-[5%] sm:left-[10%] md:left-[25%] w-1/4 max-w-[80px] lg:max-w-[100px] aspect-square bg-white rounded-lg flex items-center justify-center text-3xl sm:text-4xl md:text-5xl">
                                📱
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center px-16 py-8 items-center bg-background">
                    <div className="max-w-[540px] flex flex-col max-lg:items-center">
                        <div className="flex gap-2 ">
                            <img src={Logo} alt="" className="w-[50px] " />
                            <img src={Name} alt="" className="h-50px" />
                        </div>
                        <p className="text-lg text-center">
                            Наше приложение помогает покупать рекламу в
                            Telegram-каналах и автоматизировать процесс её
                            продажи.{' '}
                        </p>
                    </div>
                    <div className="bg-blue rounded-2xl items-center max-lg:hidden">
                        <a
                            href=""
                            className=" p-3 text-xl  text-white gap-3 flex items-center"
                        >
                            <img src={Arrow} alt="" />
                            <p className="text-base">Начать сейчас</p>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
