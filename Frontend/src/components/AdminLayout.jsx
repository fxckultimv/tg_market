import React from 'react'
import { Outlet } from 'react-router-dom'
import Logout from '../assets/admin/logout.svg?react'
import Home from '../assets/admin/home.svg?react'
import Users from '../assets/admin/users.svg?react'
import Products from '../assets/admin/products.svg?react'
import Orders from '../assets/admin/orders.svg?react'
import Category from '../assets/admin/category.svg?react'
import Conflict from '../assets/admin/conflict.svg?react'
import Promo from '../assets/admin/promo.svg?react'
import Money from '../assets/admin/money.svg?react'
import { useState } from 'react'
import AdminCastomLink from './AdminCastomLink'
import { Link } from 'react-router-dom'

const AdminLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div className="admin-layout flex ">
            <nav className="bg-gray fixed top-0 left-0 h-full overflow-y-auto flex flex-col">
                <div className="flex flex-col flex-grow m-4 gap-4">
                    <Link to="..">
                        <Logout className="text-red" />
                    </Link>
                    <AdminCastomLink to="/admin">
                        <Home />
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/users">
                        <Users />
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/products">
                        <Products />
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/orders">
                        <Orders />
                    </AdminCastomLink>

                    <AdminCastomLink to="/admin/categories">
                        <Category />
                    </AdminCastomLink>
                    <AdminCastomLink to="/admin/conflict">
                        <Conflict />
                    </AdminCastomLink>
                    <AdminCastomLink to="/admin/promo">
                        <Promo />
                    </AdminCastomLink>
                    <AdminCastomLink to="/admin/transactions">
                        <Money />
                    </AdminCastomLink>
                </div>
            </nav>
            <div className="admin-content ml-[60px] flex-grow overflow-y-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
