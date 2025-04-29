import React, { useEffect } from 'react'
import { useUserStore } from '../../store'
import Error from '../../Error'
import Loading from '../../Loading'
import banner from '../../assets/banner.svg'
import time from '../../assets/time.gif'
import DuckGlass from '../../assets/duckGlass.webp'
import DuckOne from '../../assets/duckOne.webp'
import Arrow2 from '../../assets/Arrow2.svg'
import star from '../../assets/star.svg'
import topor from '../../assets/topor.png'
import arrowDown from '../../assets/chevron-down.svg'
import user from '../../assets/subscribers.svg'
import view from '../../assets/view.svg'
import Arrow from '../../assets/Arrow.svg'
import Logo from '../../assets/logo.svg'
import Ton from '../../assets/ton_symbol.svg'
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
import Whell1 from './Whell1'
import Whell2 from './Whell2'
import FAQ from './FAQ'
import MainButtonTest from './MainButtonTest'

const Home = () => {
    const { loading, error } = useUserStore()

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
            <Whell1 />
            <div className="flex flex-row gap-8 m-6 max-md:flex-col">
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
                        className="absolute top-1/2 transform -translate-y-1/4 right-8 w-3/4 z-0 max-md:right-2 max-md:top-0"
                    />
                </div>
                <div className="basis-1/3 bg-gradient-radial from-white to-main-gray  p-8 rounded-3xl flex flex-col items-center border-2">
                    <img
                        src={DuckGlass}
                        alt="Рекламодатель"
                        className=" mb-4"
                    />
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
                            src={DuckOne}
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
                    <h1 className="text-3xl font-semibold mb-2 text-center">
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
                <div className="flex gap-8 items-center overflow-x-auto max-md:gap-4">
                    <div className="flex-grow bg-phone-blue rounded-3xl items-center flex flex-col px-[38px] pt-[70px] max-w-full">
                        <div className="w-full flex justify-between mb-4">
                            <h2 className="text-white text-3xl max-md:text-lg">
                                Бизнес
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
                            <div className="relative z-10 text-white">
                                <div className="flex justify-between items-center p-7">
                                    <p className="text-white">9:41</p>
                                    <div className="flex gap-2">
                                        <img src={Cellular} alt="" />
                                        <img src={Wifi} alt="" />
                                        <img src={Battery} alt="" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-5 ">
                                    <img src={Shape} alt="" />

                                    {/* Текстовый блок - занимает всю доступную ширину */}
                                    <div className="flex-1 flex flex-col items-center text-center">
                                        <h2 className="text-base font-bold">
                                            Интернет магазин
                                        </h2>
                                        <p className="text-xs">
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
                    <div className="flex-grow bg-dark-blue rounded-3xl items-center flex flex-col px-[38px] pt-[70px] max-w-full">
                        <div className="w-full flex justify-between mb-4">
                            <h2 className="text-white text-2xl max-md:text-lg">
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
                            <div className="relative z-10 text-white">
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
                                    <div className="flex flex-col items-center text-center">
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
                    <div className="flex-grow bg-phone-blue rounded-3xl items-center flex flex-col px-[38px] pt-[70px] max-w-full">
                        <div className="w-full flex justify-between mb-4">
                            <h2 className="text-white text-2xl max-md:text-lg">
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
                            <div className="relative z-10 text-white">
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
                {/* <FAQ className="z-50" /> */}

                <div className="flex flex-col items-center text-center py-10 relative bg-background">
                    {/* Фоновое изображение */}
                    {/* <img
                        src={Ellipse}
                        alt="Background2"
                        className="absolute bottom-20 z-0 rotate-180"
                    /> */}
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
                    <Whell2 />
                </div>
            </div>
        </>
    )
}

export default Home
