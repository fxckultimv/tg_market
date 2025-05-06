import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAdminStore } from '../../../store'
import UserProducts from './UserProducts'
import UserOrders from './UserOrders'
import UserCart from './UserCart'
import BackButton from '../../../components/BackButton'
import DefaultImage from '../../../assets/defaultImage.png'
import { initDataRaw } from '@telegram-apps/sdk-react'

const SingleUser = () => {
    const { user, fetchUserForId, loading, error } = useAdminStore()
    const { id } = useParams()
    const [activeSection, setActiveSection] = useState('products')

    useEffect(() => {
        fetchUserForId(initDataRaw(), id)
    }, [id])

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'products':
                return <UserProducts user_id={user.user_id} />
            case 'orders':
                return <UserOrders user_id={user.user_id} />
            case 'cart':
                return <UserCart user_id={user.user_id} />
            default:
                return null
        }
    }

    return (
        <div>
            <BackButton />
            {user && (
                <div className="flex bg-card-white rounded-lg p-2 m-2">
                    <img
                        src={`` || DefaultImage}
                        alt={
                            <div className="text-xl font-bold">
                                {user.username}
                            </div>
                        }
                        className="rounded-full max-h-[111px]"
                        onError={(e) => {
                            e.currentTarget.src = DefaultImage
                        }}
                    />
                    <div key={user.user_id} className="p-4 rounded-lg">
                        <div className="text-xl font-bold">{user.username}</div>
                        <div
                            className="text-gray cursor-pointer hover:underline"
                            onClick={() =>
                                navigator.clipboard.writeText(user.user_id)
                            }
                            title="Копировать"
                        >
                            <span className="">ID:</span> {user.user_id}
                        </div>

                        <div className="">
                            <span className="">Рейтинг:</span> {user.rating}
                        </div>
                        <div className="">
                            <span className="">Дата создания:</span>{' '}
                            {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex space-x-4 m-4">
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'products' ? 'bg-blue' : 'bg-gray'
                    }`}
                    onClick={() => setActiveSection('products')}
                >
                    Продукты
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'orders' ? 'bg-blue' : 'bg-gray'
                    }`}
                    onClick={() => setActiveSection('orders')}
                >
                    Заказы
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeSection === 'cart' ? 'bg-blue' : 'bg-gray'
                    }`}
                    onClick={() => setActiveSection('cart')}
                >
                    Корзина
                </button>
            </div>

            <div className="m-2 rounded-xl">{renderActiveSection()}</div>
        </div>
    )
}

export default SingleUser
