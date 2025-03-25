import React, { useEffect } from 'react'
import { useAdminStore } from '../../store'
import { Link } from 'react-router-dom'
import Users from '../../assets/admin/users.svg'
import Cart from '../../assets/admin/cart.svg'
import Orders from '../../assets/admin/orders.svg'
import { nanoTonToTon } from '../../utils/tonConversion'
import OrdersInMounthChart from './OrdersInMounthChart'
import { initDataRaw } from '@telegram-apps/sdk-react'

const AdminStats = () => {
    const { stats, fetchStats, loading, error } = useAdminStore()

    useEffect(() => {
        if (!stats || Object.keys(stats).length === 0) {
            fetchStats(initDataRaw())
        }
    }, [fetchStats, stats])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-dark-gray p-4">
            <h1 className="text-2xl font-bold mb-4 text-main-green">Админка</h1>
            <div className="grid grid-cols-4  gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
                <Link to={'users'} className="bg-card-white rounded-lg">
                    <div>
                        <div className="flex justify-between items-center p-2">
                            <p>Пользователей</p> <p>+4%</p>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <img src={Users} alt="" className="h-[50px]" />
                            <p className="text-2xl">{stats.totalUsers}</p>
                        </div>
                        <p className="bg-gray p-2 rounded-b-lg">Подробнее...</p>
                    </div>
                </Link>
                <Link to={'users'} className="bg-card-white rounded-lg">
                    <div>
                        <div className="flex justify-between items-center p-2">
                            <p>Всего продаж</p> <p>+3%</p>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <img src={Users} alt="" className="h-[50px]" />
                            <p className="text-2xl">
                                {nanoTonToTon(stats.totalRevenue).toFixed(2)}{' '}
                                ton
                            </p>
                        </div>
                        <p className="bg-gray p-2 rounded-b-lg">Подробнее...</p>
                    </div>
                </Link>
                <Link to={'products'} className="bg-card-white rounded-lg">
                    <div>
                        <div className="flex justify-between items-center p-2">
                            <p>Продуктов</p> <p>+4%</p>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <img src={Cart} alt="" className="h-[50px]" />
                            <p className="text-2xl">{stats.totalProducts}</p>
                        </div>
                        <p className="bg-gray p-2 rounded-b-lg">Подробнее...</p>
                    </div>
                </Link>
                <Link to={'orders'} className="bg-card-white rounded-lg">
                    <div>
                        <div className="flex justify-between items-center p-2">
                            <p>Заказов</p> <p>+4%</p>
                        </div>
                        <div className="flex justify-between items-center p-2">
                            <img src={Orders} alt="" className="h-[50px]" />
                            <p className="text-2xl">{stats.totalOrders}</p>
                        </div>
                        <p className="bg-gray p-2 rounded-b-lg">Подробнее...</p>
                    </div>
                </Link>
            </div>
            <OrdersInMounthChart orders={stats.OrdersMonth} className={''} />
            {/* <div className="w-full h-5 my-5 bg-slate-400 rounded-full"></div>
            <div className="flex flex-wrap gap-4">
                <StatCard
                    title="Новые продукты сегодня"
                    value={stats.newProductsToday}
                />
                <StatCard
                    title="Новые продукты за неделю"
                    value={stats.newProductsThisWeek}
                />
                <StatCard
                    title="Новые продукты за месяц"
                    value={stats.newProductsThisMonth}
                />
                <StatCard
                    title="Новые продукты за год"
                    value={stats.newProductsThisYear}
                />
            </div>
            <div className="w-full h-5 my-5 bg-slate-400 rounded-full"></div>
            <div className="flex flex-wrap gap-4">
                <StatCard
                    title="Новые заказы сегодня"
                    value={stats.newOrdersToday}
                />
                <StatCard
                    title="Новые заказы за неделю"
                    value={stats.newOrdersThisWeek}
                />
                <StatCard
                    title="Новые заказы за месяц"
                    value={stats.newOrdersThisMonth}
                />
                <StatCard
                    title="Новые заказы за год"
                    value={stats.newOrdersThisYear}
                />
            </div>
            <div className="w-full h-5 my-5 bg-slate-400 rounded-full"></div>
            <div className="flex flex-wrap gap-4">
                <StatCard
                    title="Новые пользователи сегодня"
                    value={stats.newUsersToday}
                />
                <StatCard
                    title="Новые пользователи за неделю"
                    value={stats.newUsersThisWeek}
                />
                <StatCard
                    title="Новые пользователи за месяц"
                    value={stats.newUsersThisMonth}
                />
                <StatCard
                    title="Новые пользователи за год"
                    value={stats.newUsersThisYear}
                />
            </div> */}
        </div>
    )
}

const StatCard = ({ title, value }) => {
    return (
        <div className="flex flex-col items-start bg-medium-gray rounded-md p-4 shadow-md hover:bg-gray-700 transition duration-300 w-40">
            <div className="text-sm font-semibold mb-1 text-gray-300">
                {title}
            </div>
            <div className="text-2xl font-bold text-main-green">{value}</div>
        </div>
    )
}

export default AdminStats
