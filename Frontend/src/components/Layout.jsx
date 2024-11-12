import { Outlet } from 'react-router-dom'
import CustomLink from './HeaderCustomLink'
import Logo from '../assets/logo.svg'
import Name from '../assets/TeleAdMarket.svg'
import Arrow from '../assets/Arrow.svg'
import LogoGray from '../assets/logo grey.svg'
import NameGray from '../assets/TeleAdMarket grey.svg'
import { useState } from 'react'
import { useEffect } from 'react'

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
        <div>
            <header className="bg-background flex space-x-0 min-w-full justify-between p-4 items-center">
                {/* Логотип */}
                <div className="flex gap-2">
                    <img src={Logo} alt="Logo" className="w-[27px]" />
                    <img
                        src={Name}
                        alt="Name"
                        className="h-28px min-w-[78px]"
                    />
                </div>

                {/* Блок с ссылками (скрывается на маленьких экранах) */}
                <div className="hidden md:flex gap-2 items-center">
                    <CustomLink to="/">Главная</CustomLink>
                    <CustomLink to="/channels">Объявления</CustomLink>
                    <CustomLink to="/create-ad">Создать объявление</CustomLink>
                    <CustomLink to="/basket">Корзина</CustomLink>
                    <CustomLink to="/profile">Профиль</CustomLink>
                </div>

                {/* Блок с кнопкой (видимый только на больших экранах) */}
                <div className="bg-blue rounded-2xl items-center hidden lg:block">
                    <a href="#" className="p-3 text-base text-white gap-3 flex">
                        <img src={Arrow} alt="Arrow" />
                        Начать сейчас
                    </a>
                </div>

                {/* Бургер-иконка (видимая только на маленьких экранах) */}
                <button className="block md:hidden p-2" onClick={toggleMenu}>
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
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Выпадающее меню */}
                {menuOpen && (
                    <div className="fixed top-0 right-0 bottom-0 left-0 h-full bg-white z-50 flex flex-col p-4 overflow-hidden">
                        <button className="self-end p-2" onClick={toggleMenu}>
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
                        <CustomLink to="/">Главная</CustomLink>
                        <CustomLink to="/channels">Объявления</CustomLink>
                        <CustomLink to="/create-ad">
                            Создать объявление
                        </CustomLink>
                        <CustomLink to="/basket">Корзина</CustomLink>
                        <CustomLink to="/profile">Профиль</CustomLink>
                    </div>
                )}
            </header>
            <Outlet></Outlet>
            <div className="flex justify-between px-16 py-8 items-center max-md:justify-center">
                {' '}
                <div
                    className="flex gap-6 items-center
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
