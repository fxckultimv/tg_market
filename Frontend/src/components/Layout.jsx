import { Outlet } from 'react-router-dom'
import CustomLink from './HeaderCustomLink'
import Logo from '../assets/logo.svg'
import Carrot from '../assets/carrot.svg'
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
import Home from '../assets/layout/home.svg?react'
import Buy from '../assets/layout/buy.svg?react'
import Create from '../assets/layout/create.svg?react'
import Cart from '../assets/layout/cart.svg?react'
import Account from '../assets/layout/account.svg?react'

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
            <header className="bg-background flex space-x-0 min-w-full justify-between p-4 items-center pt-10 relative">
                {/* Логотип */}
                <Link to="/" className="flex gap-1">
                    <img src={Carrot} alt="Logo" className="w-[27px]" />
                    <p className="text-2xl text-text font-bold">Carrot</p>
                    {/* <img
                        src={Name}
                        alt="Name"
                        className="h-28px min-w-[78px]"
                    /> */}
                    <p className="bg-red text-white rounded-full px-2 flex items-center justify-center">
                        test
                    </p>
                </Link>
            </header>

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-card-white py-4">
                <div className="flex justify-evenly items-center max-w-md mx-auto w-full">
                    <CustomLink to="/">
                        <Home />
                    </CustomLink>
                    <CustomLink to="/channels">
                        <Buy />
                    </CustomLink>
                    <CustomLink to="/create-ad">
                        <Create />
                    </CustomLink>
                    <CustomLink to="/basket">
                        <Cart />
                    </CustomLink>
                    <CustomLink to="/profile">
                        <Account />
                    </CustomLink>
                </div>
            </div>

            <Outlet></Outlet>
            <div className="h-8"></div>

            {/* <div className="flex justify-between px-16 py-8 items-center max-md:justify-center bg-background mb-8">
                {' '}
                <div
                    className="flex gap-6 items-center text-text max-md:flex-col
                "
                >
                    <p>support@teleadmarket.com</p>
                    <div className="w-2 h-2 bg-gray rounded-full max-md:hidden"></div>
                    <p>© Carrot, 2024</p>
                </div>{' '}
                <div className="flex gap-2 max-md:hidden">
                    <img src={LogoGray} alt="" />
                    <img src={NameGray} alt="" />
                </div>
            </div> */}
        </div>
    )
}

export default Layout
