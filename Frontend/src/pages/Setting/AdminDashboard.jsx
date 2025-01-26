import React, { useEffect } from 'react'
import { useLaunchParams } from '@tma.js/sdk-react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store'
import AdminStats from '../adminDashboard/AdminStats'

const Admin = () => {
    const { initDataRaw } = useLaunchParams()
    const { isAdmin, loading, error, checkAdmin } = useAdminStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAdmin) {
            checkAdmin(initDataRaw)
        }
    }, [initDataRaw, checkAdmin, isAdmin])

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
