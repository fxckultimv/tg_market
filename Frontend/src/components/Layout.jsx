import { Outlet } from 'react-router-dom'
import CustomLink from './HeaderCustomLink'
import Logo from '../assets/logo.svg'
import Name from '../assets/TeleAdMarket.svg'
import Arrow from '../assets/Arrow.svg'
import LogoGray from '../assets/logo grey.svg'
import Menu from '../assets/menu.svg'
import NameGray from '../assets/TeleAdMarket grey.svg'
import { useState } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const Layout = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
        // Удаляет класс при размонтировании компонента
        return () => document.body.classList.remove('overflow-hidden')
    }, [menuOpen])

    // Закрываем меню при изменении ширины окна
    useEffect(() => {
        const handleResize = () => {
            setMenuOpen(false)
        }

        // Подписываемся на событие изменения размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                handleResize()
            }
        })

        // Отписываемся от события при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="bg-background">
            <header className="bg-background flex space-x-0 min-w-full justify-between p-4 items-center">
                {/* Логотип */}
                <Link to="/" className="flex gap-2">
                    <img src={Logo} alt="Logo" className="w-[27px]" />
                    <p className="text-2xl text-text">TeleAd</p>
                    {/* <img
                        src={Name}
                        alt="Name"
                        className="h-28px min-w-[78px]"
                    /> */}
                    <p className="bg-red text-white rounded-full px-2 flex items-center justify-center">
                        test
                    </p>
                </Link>

                {/* Блок с ссылками (скрывается на маленьких экранах) */}
                <div className="hidden md:flex gap-2 items-center">
                    <CustomLink to="/">Главная</CustomLink>
                    <CustomLink to="/channels">Объявления</CustomLink>
                    <CustomLink to="/create-ad">Создать объявление</CustomLink>
                    <CustomLink to="/basket">Корзина</CustomLink>
                    <CustomLink to="/profile">Профиль</CustomLink>
                </div>

                {/* Блок с кнопкой (видимый только на больших экранах) */}
                <Link
                    to="channels"
                    className="bg-blue rounded-2xl items-center hidden lg:block"
                >
                    <p href="#" className="p-3 text-base text-white gap-3 flex">
                        <img src={Arrow} alt="Arrow" />
                        Начать сейчас
                    </p>
                </Link>

                {/* Бургер-иконка (видимая только на маленьких экранах) */}
                <button
                    className="md:hidden p-2 bg-blue flex justify-between gap-2 items-center rounded-xl"
                    onClick={toggleMenu}
                >
                    <img src={Menu} alt="" />
                    <p className="text-white">Меню</p>
                </button>

                {/* Выпадающее меню */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            className="bg-background absolute top-0 right-0 bottom-0 left-0 h-full z-50 flex flex-col p-4 overflow-hidden"
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.4, type: 'spring' }}
                        >
                            <button
                                className="self-end p-2"
                                onClick={toggleMenu}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <CustomLink to="/">
                                <p className="text-2xl">Главная</p>
                            </CustomLink>
                            <CustomLink to="/channels">
                                <p className="text-2xl">Объявления</p>
                            </CustomLink>
                            <CustomLink to="/create-ad">
                                <p className="text-2xl">Создать объявление</p>
                            </CustomLink>
                            <CustomLink to="/basket">
                                {' '}
                                <p className="text-2xl">Корзина</p>
                            </CustomLink>
                            <CustomLink to="/profile">
                                <p className="text-2xl">Профиль</p>
                            </CustomLink>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            <Outlet></Outlet>
            <div className="flex justify-between px-16 py-8 items-center max-md:justify-center bg-background">
                {' '}
                <div
                    className="flex gap-6 items-center text-text
                "
                >
                    <p>support@teleadmarket.com</p>
                    <div className="w-2 h-2 bg-gray rounded-full"></div>
                    <p>© TeleAdMarket, 2024</p>
                </div>{' '}
                <div className="flex gap-2 max-md:hidden">
                    <img src={LogoGray} alt="" />
                    <img src={NameGray} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Layout
