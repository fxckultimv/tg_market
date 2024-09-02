import React, { useEffect } from 'react'
import { useAdminStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'

const AdminStats = () => {
    const { initDataRaw } = useLaunchParams()
    const { stats, fetchStats, loading, error } = useAdminStore()

    useEffect(() => {
        if (!stats || Object.keys(stats).length === 0) {
            fetchStats(initDataRaw)
        }
    }, [initDataRaw, fetchStats, stats])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-2xl font-bold mb-4 text-green-400">
                Административная статистика
            </h1>
            <div className="flex flex-wrap gap-4">
                <Link to={'users'}>
                    <StatCard
                        title="Всего пользователей"
                        value={stats.totalUsers}
                    />
                </Link>
                <StatCard
                    title="Общий оборот"
                    value={`₽${stats.totalRevenue}`}
                />
                <Link to={'products'}>
                    <StatCard
                        title="Всего продуктов"
                        value={stats.totalProducts}
                    />
                </Link>

                <Link to={'orders'}>
                    <StatCard title="Всего заказов" value={stats.totalOrders} />
                </Link>
            </div>
            <div className="w-full h-5 my-5 bg-slate-400 rounded-full"></div>
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
            </div>
        </div>
    )
}

const StatCard = ({ title, value }) => {
    return (
        <div className="flex flex-col items-start bg-gray-800 rounded-md p-4 shadow-md hover:bg-gray-700 transition duration-300 w-40">
            <div className="text-sm font-semibold mb-1 text-gray-300">
                {title}
            </div>
            <div className="text-2xl font-bold text-green-400">{value}</div>
        </div>
    )
}

export default AdminStats
