import React, { useEffect, useState } from 'react'
import Form from './components/Form'
import List from './components/List'
import {
    retrieveLaunchParams,
    useLaunchParams,
    useSettingsButton,
    useViewport,
} from '@tma.js/sdk-react'
import usePreventCollapse from './usePreventCollapse'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home/Home'
import Channels from './pages/Channels/Channels'
import ChannelDetails from './pages/Channels/ChannelDetails'
import Settings from './pages/Settings'
import CreateAd from './pages/CreateAd/CreateAd'
import { NotFoundPage } from './pages/NotFoundPage'
import { useNavigate } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import History from './pages/History'
import SingleHistory from './pages/SingleHistory'
import AdminDashboard from './pages/Setting/AdminDashboard'
import AdminLayout from './pages/adminDashboard/AdminLayout'
import AdminUsers from './pages/adminDashboard/AdminUsers/AdminUsers'
import AdminProducts from './pages/adminDashboard/AdminProducts/AdminProducts'
import AdminOrders from './pages/adminDashboard/AdminOrders/AdminOrders'
import { useAdminStore } from './store'
import AdminCategories from './pages/adminDashboard/AdminCategories'
import SingleUser from './pages/adminDashboard/UserPage/SingleUser'
import OrderDetails from './pages/adminDashboard/OrderDetails/OrderDetails'
import ProductDetails from './pages/adminDashboard/ProductDetails/ProductDetails'
import Buy from './pages/Buy/Buy'
import BuyOrder from './pages/Buy/BuyOrder'
// import { useStore } from '../store'

const App = () => {
    const { isAdmin, loading, checkAdmin } = useAdminStore()
    const { initDataRaw } = useLaunchParams()
    const navigate = useNavigate()
    const settingsButton = useSettingsButton()

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

    // Проверка прав администратора при загрузке
    useEffect(() => {
        checkAdmin(initDataRaw)
    }, [checkAdmin, initDataRaw])

    // if (loading) {
    //     return <div>Загрузка...</div>
    // }

    return (
        <div>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />

                    <Route path="channels" element={<Channels />} />
                    <Route path="channels/:id" element={<ChannelDetails />} />

                    <Route path="create-ad" element={<CreateAd />} />

                    <Route path="history" element={<History />} />
                    <Route path="history/:id" element={<SingleHistory />} />

                    <Route path="basket" element={<Cart />} />

                    <Route path="buy" element={<Buy />} />
                    <Route path="buy/:id" element={<BuyOrder />} />

                    {isAdmin && (
                        <Route path="admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />}></Route>
                            <Route
                                path="users"
                                element={<AdminUsers />}
                            ></Route>
                            <Route
                                path="users/:id"
                                element={<SingleUser />}
                            ></Route>
                            <Route
                                path="products"
                                element={<AdminProducts />}
                            ></Route>
                            <Route
                                path="products/:id"
                                element={<ProductDetails />}
                            ></Route>
                            <Route
                                path="orders"
                                element={<AdminOrders />}
                            ></Route>
                            <Route
                                path="orders/:id"
                                element={<OrderDetails />}
                            ></Route>
                            <Route
                                path="categories"
                                element={<AdminCategories />}
                            ></Route>
                        </Route>
                    )}

                    <Route path="settings" element={<Settings />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App