import React from 'react'
import { Outlet } from 'react-router-dom'
import Home from '../assets/admin/home.svg'
import Users from '../assets/admin/users.svg'
import Products from '../assets/admin/products.svg'
import Orders from '../assets/admin/orders.svg'
import Category from '../assets/admin/category.svg'
import Money from '../assets/admin/money.svg'
import Menu from '../assets/admin/menu.svg'
import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminCastomLink from './AdminCastomLink'

const AdminLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }
    return (
        <div className="admin-layout flex ">
            <motion.nav
                initial={{ width: '60px' }}
                animate={{ width: menuOpen ? '200px' : '60px' }}
                transition={{ duration: 0.5 }}
                className="bg-gray fixed top-0 left-0 h-full overflow-y-auto flex flex-col"
            >
                <div
                    className="flex flex-col flex-grow m-4 gap-4"
                    onClick={toggleMenu}
                >
                    <AdminCastomLink to="/admin">
                        <img src={Home} alt="" />
                        {menuOpen && <p>Dashboard</p>}
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/users">
                        <img src={Users} alt="" />
                        {menuOpen && <p>Users</p>}
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/products">
                        <img src={Products} alt="" />
                        {menuOpen && <p>Products</p>}
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/orders">
                        <img src={Orders} alt="" />
                        {menuOpen && <p>Orders</p>}
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/categories">
                        <img src={Category} alt="" />
                        {menuOpen && <p>Categories</p>}
                    </AdminCastomLink>
                    <AdminCastomLink to="/admin/transactions">
                        <img src={Money} alt="" />
                        {menuOpen && <p>Transactions</p>}
                    </AdminCastomLink>
                </div>
                <div className="mt-auto cursor-pointer" onClick={toggleMenu}>
                    <img src={Menu} alt="" />
                </div>
            </motion.nav>
            <div className="admin-content ml-[60px] flex-grow overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
