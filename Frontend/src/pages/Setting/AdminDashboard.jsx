import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore, useUserStore } from '../../store'
import AdminStats from '../adminDashboard/AdminStats'

const Admin = () => {
    const { loading, error, checkAdmin } = useAdminStore()
    const { isAdmin } = useUserStore()
    const navigate = useNavigate()

    if (loading) {
        return <div>Загрузка...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return <div>{isAdmin ? <AdminStats /> : <NotAuthorized />}</div>
}

const NotAuthorized = () => {
    return <div>У вас нет прав для доступа к этой странице</div>
}

export default Admin
