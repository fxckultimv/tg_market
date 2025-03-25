import React, { useEffect } from 'react'
import {
    initData,
    initDataRaw,
    settingsButton,
    viewport,
    swipeBehavior,
} from '@telegram-apps/sdk-react'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ProfileLayout from './components/ProfileLayout'
import Home from './pages/Home/Home'
import Channels from './pages/Channels/Channels'
import ChannelDetails from './pages/Channels/ChannelDetails'
import User from './pages/User/User'
import Settings from './pages/Setting/Settings'
import CreateAd from './pages/CreateAd/CreateAd'
import { NotFoundPage } from './pages/NotFoundPage'
import Cart from './pages/Cart/Cart'
import BuyOrder from './pages/Buy/BuyOrder'
import HowCreate from './pages/CreateAd/HowCreate'
import History from './pages/History/History'
import SingleHistory from './pages/History/SingleHistory'
import MyChannels from './pages/MyChannels/MyChannels'
import Products from './pages/Products/Products/Products'
import ChannelStats from './pages/Products/ChannelStats/ChannelStats'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/Setting/AdminDashboard'
import AdminUsers from './pages/adminDashboard/AdminUsers/AdminUsers'
import SingleUser from './pages/adminDashboard/UserPage/SingleUser'
import AdminProducts from './pages/adminDashboard/AdminProducts/AdminProducts'
import ProductDetails from './pages/adminDashboard/ProductDetails/ProductDetails'
import AdminOrders from './pages/adminDashboard/AdminOrders/AdminOrders'
import OrderDetails from './pages/adminDashboard/OrderDetails/OrderDetails'
import AdminCategories from './pages/adminDashboard/AdminCategories'
import AdminTransactions from './pages/adminDashboard/AdminTransactions/AdminTransactions'

import { useAdminStore, useUserStore } from './store'
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from './components/AnimatedPage'
import SessionExpiredModal from './components/SessionExpiredModal'
import Rulers from './pages/Rules/Rules'

const App = () => {
    const navigate = useNavigate()
    const { fetchAuth, theme, setTheme, sessionExpired } = useUserStore()

    const location = useLocation()
    const { isAdmin, checkAdmin } = useAdminStore()

    // //кастомный хук для того чтобы убать закрытие приложения при скроле
    // usePreventCollapse()

    // useEffect(() => {
    //     const applyFullscreen = async () => {
    //         if (typeof viewport !== 'undefined') {
    //             // Проверяем доступность viewport
    //             if (isFullscreen) {
    //                 if (viewport.requestFullscreen.isAvailable()) {
    //                     await viewport.exitFullscreen()
    //                 }
    //             } else {
    //                 if (viewport.exitFullscreen.isAvailable()) {
    //                     await viewport.requestFullscreen()
    //                 }
    //             }
    //         }
    //     }
    //     applyFullscreen()
    // }, [isFullscreen])

    useEffect(() => {
        fetchAuth(initDataRaw())
        checkAdmin(initDataRaw())
    }, [fetchAuth, checkAdmin])

    // Проверка прав администратора при загрузке
    // useEffect(() => {
    //     checkAdmin()
    // }, [checkAdmin])

    // useEffect(() => {
    //     const applyFullscreen = async () => {
    //         // Проверяем доступность метода и что компонент ещё "жив"
    //         if (viewport?.isAvailable?.('requestFullscreen')) {
    //             try {
    //                 await viewport.requestFullscreen()
    //             } catch (err) {
    //                 console.warn('Не удалось включить fullscreen:', err)
    //             }
    //         }
    //     }

    //     applyFullscreen()
    // }, [])

    //Кнопка настрек

    useEffect(() => {
        swipeBehavior.disableVertical()
        if (settingsButton.mount.isAvailable()) {
            settingsButton.mount()
        }
        if (settingsButton.show.isAvailable()) {
            settingsButton.show()
        }

        let offClick
        if (settingsButton.onClick.isAvailable()) {
            offClick = settingsButton.onClick(() => navigate('/settings'))
        }

        return () => {
            if (offClick) offClick()
            if (!settingsButton.mount.isAvailable()) {
                settingsButton.unmount()
            }
        }
    }, [])

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
                            path="how-create"
                            element={
                                <AnimatedPage>
                                    <HowCreate />
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

                        <Route
                            path="rules"
                            element={
                                <AnimatedPage>
                                    <Rulers />
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
                                />{' '}
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
                                />{' '}
                                <Route
                                    path="orders"
                                    element={
                                        <AnimatedPage>
                                            <AdminOrders />
                                        </AnimatedPage>
                                    }
                                />{' '}
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
                                <Route
                                    path="transactions"
                                    element={
                                        <AnimatedPage>
                                            <AdminTransactions />
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
