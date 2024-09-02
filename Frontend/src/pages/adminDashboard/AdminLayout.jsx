import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/admin">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/users">Users</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/products">Products</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/orders">Orders</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/categories">Categories</NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="/admin/channels">Channels</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/ads">Ads</NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/settings">Settings</NavLink>
                    </li> */}
                </ul>
            </nav>
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
