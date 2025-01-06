import React, { useEffect, useState } from 'react'
import {
    retrieveLaunchParams,
    useInitData,
    useInitDataRaw,
    useLaunchParams,
    useSettingsButton,
    useThemeParamsRaw,
    useViewport,
} from '@tma.js/sdk-react'
import usePreventCollapse from './usePreventCollapse'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProfileLayout from './components/ProfileLayout'
import Home from './pages/Home/Home'
import Channels from './pages/Channels/Channels'
import ChannelDetails from './pages/Channels/ChannelDetails'
import Settings from './pages/Setting/Settings'
import CreateAd from './pages/CreateAd/CreateAd'
import { NotFoundPage } from './pages/NotFoundPage'
import { useNavigate } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import History from './pages/History/History'
import SingleHistory from './pages/History/SingleHistory'
import AdminDashboard from './pages/Setting/AdminDashboard'
import AdminLayout from './components/AdminLayout'
import AdminUsers from './pages/adminDashboard/AdminUsers/AdminUsers'
import AdminProducts from './pages/adminDashboard/AdminProducts/AdminProducts'
import AdminOrders from './pages/adminDashboard/AdminOrders/AdminOrders'
import { useAdminStore, useUserStore } from './store'
import AdminCategories from './pages/adminDashboard/AdminCategories'
import SingleUser from './pages/adminDashboard/UserPage/SingleUser'
import OrderDetails from './pages/adminDashboard/OrderDetails/OrderDetails'
import ProductDetails from './pages/adminDashboard/ProductDetails/ProductDetails'
import Buy from './pages/Buy/Buy'
import BuyOrder from './pages/Buy/BuyOrder'
import MyChannels from './pages/MyChannels/MyChannels'
import User from './pages/User/User'
import Profile from './pages/Profile/Profile'
import Products from './pages/Products/Products/Products'
import ChannelStats from './pages/Products/ChannelStats/ChannelStats'
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from './components/AnimatedPage'
import { useLocation } from 'react-router-dom'
import SessionExpiredModal from './SessionExpiredModal'
// import { useStore } from '../store'

const App = () => {
    const { isAdmin } = useAdminStore()
    const { initDataRaw } = useLaunchParams()
    const navigate = useNavigate()
    const settingsButton = useSettingsButton()
    const { theme, setTheme } = useUserStore()
    const initData = useInitDataRaw()
    const setInitData = useUserStore((state) => state.setInitData)
    useEffect(() => {
        if (initData) {
            setInitData(initData)
        }
    }, [])

    const location = useLocation()

    const { sessionExpired } = useUserStore()

    //кастомный хук для того чтобы убать закрытие приложения при скроле
    usePreventCollapse()

    //Открытие приложения на всё высоту при запуске
    const viewport = useViewport()

    useEffect(() => {
        if (viewport) {
            viewport.expand()
        }
    }, [viewport])

    //Кнопка настрек

    useEffect(() => {
        if (settingsButton) {
            settingsButton.show()

            const handleSettingsClick = () => {
                navigate('/settings')
            }

            settingsButton.on('click', handleSettingsClick)

            return () => {
                settingsButton.hide()
                settingsButton.off('click', handleSettingsClick)
            }
        }
    }, [settingsButton, navigate])

    useEffect(() => {
        // Получаем тему из localStorage при загрузке компонента
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)

        // Устанавливаем начальный класс на <html> элемент
        document.body.classList.add(savedTheme)
    }, [setTheme])

    // // Получение темы пользователя
    // const theme = useThemeParamsRaw()

    // useEffect(() => {
    //     if (theme?.result?.state?.state) {
    //         const { buttonColor, buttonTextColor, bgColor, accentTextColor } =
    //             theme.result.state.state
    //         // Обновляем CSS переменные
    //         document.documentElement.style.setProperty('--bg-color', bgColor)
    //         document.documentElement.style.setProperty(
    //             '--button-color',
    //             buttonColor
    //         )
    //         document.documentElement.style.setProperty(
    //             '--button-text-color',
    //             buttonTextColor
    //         )
    //         document.documentElement.style.setProperty(
    //             '--accent-color',
    //             accentTextColor
    //         )
    //     }
    // }, [theme])

    // if (loading) {
    //     return <div>Загрузка...</div>
    // }

    return (
        <div className="text-text">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <AnimatedPage>
                                    <Home />
                                </AnimatedPage>
                            }
                        />

                        <Route
                            path="channels"
                            element={
                                <AnimatedPage>
                                    <Channels />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="channels/:id"
                            element={
                                <AnimatedPage>
                                    <ChannelDetails />
                                </AnimatedPage>
                            }
                        />

                        <Route
                            path="create-ad"
                            element={
                                <AnimatedPage>
                                    <CreateAd />
                                </AnimatedPage>
                            }
                        />

                        <Route
                            path="basket"
                            element={
                                <AnimatedPage>
                                    <Cart />
                                </AnimatedPage>
                            }
                        />

                        <Route
                            path="user/:id"
                            element={
                                <AnimatedPage>
                                    <User />
                                </AnimatedPage>
                            }
                        />

                        <Route
                            path="buy"
                            element={
                                <AnimatedPage>
                                    <Buy />
                                </AnimatedPage>
                            }
                        />
                        <Route
                            path="buy/:id"
                            element={
                                <AnimatedPage>
                                    <BuyOrder />
                                </AnimatedPage>
                            }
                        />

                        <Route path="profile" element={<ProfileLayout />}>
                            <Route
                                index
                                element={
                                    <AnimatedPage>
                                        <History />
                                    </AnimatedPage>
                                }
                            />

                            <Route
                                path="history/:order_id"
                                element={
                                    <AnimatedPage>
                                        <SingleHistory />
                                    </AnimatedPage>
                                }
                            />

                            <Route
                                path="my_channels"
                                element={
                                    <AnimatedPage>
                                        <MyChannels />
                                    </AnimatedPage>
                                }
                            />

                            <Route
                                path="products"
                                element={
                                    <AnimatedPage>
                                        <Products />
                                    </AnimatedPage>
                                }
                            />

                            <Route
                                path="products/:id"
                                element={
                                    <AnimatedPage>
                                        <ChannelStats />
                                    </AnimatedPage>
                                }
                            />
                        </Route>

                        <Route
                            path="settings"
                            element={
                                <AnimatedPage>
                                    <Settings />
                                </AnimatedPage>
                            }
                        />

                        {isAdmin && (
                            <Route path="admin" element={<AdminLayout />}>
                                <Route
                                    index
                                    element={
                                        <AnimatedPage>
                                            <AdminDashboard />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="users"
                                    element={
                                        <AnimatedPage>
                                            <AdminUsers />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="users/:id"
                                    element={
                                        <AnimatedPage>
                                            <SingleUser />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="products"
                                    element={
                                        <AnimatedPage>
                                            <AdminProducts />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="products/:id"
                                    element={
                                        <AnimatedPage>
                                            <ProductDetails />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="orders"
                                    element={
                                        <AnimatedPage>
                                            <AdminOrders />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="orders/:id"
                                    element={
                                        <AnimatedPage>
                                            <OrderDetails />
                                        </AnimatedPage>
                                    }
                                />
                                <Route
                                    path="categories"
                                    element={
                                        <AnimatedPage>
                                            <AdminCategories />
                                        </AnimatedPage>
                                    }
                                />
                            </Route>
                        )}

                        <Route
                            path="*"
                            element={
                                <AnimatedPage>
                                    <NotFoundPage />
                                </AnimatedPage>
                            }
                        />
                    </Route>
                </Routes>
            </AnimatePresence>
            {sessionExpired && <SessionExpiredModal />}
        </div>
    )
}

export default App
