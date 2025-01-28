import { useLaunchParams } from '@tma.js/sdk-react'
import React from 'react'
import { useProductStore } from '../../store'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import InfoBox from '../../components/InfoBox'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import arrowDown from '../../assets/chevron-down-gray.svg'
import star from '../../assets/star.svg'
import Arrow from '../../assets/Arrow.svg'
import Ton from '../../assets/ton_symbol.svg'
import UserProduct from './UserProduct'

const UserProducts = () => {
    const { initDataRaw } = useLaunchParams()
    const { id } = useParams()
    const {
        userProducts,
        fetchUserProducts,
        page,
        totalPages,
        plusPage,
        minusPage,
        error,
        loading,
    } = useProductStore()

    useEffect(() => {
        fetchUserProducts(initDataRaw, id)
    }, [fetchUserProducts, initDataRaw, page])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    if (!userProducts || userProducts.length === 0) {
        return (
            <div className="bg-text-center mt-8">
                <p>Нет доступных продуктов</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-16 max-md:p-5 max-xl:p-8 w-full">
                {userProducts.map((product) => (
                    <UserProduct key={product.product_id} product={product} />
                ))}

                {/* Контролы пагинации в ChannelsList */}
            </div>
            <div className="flex justify-center w-full mt-4 items-center gap-3">
                <button
                    onClick={minusPage}
                    className="px-3 py-2 rounded bg-gray disabled:opacity-50"
                    disabled={page === 1}
                >
                    Назад
                </button>
                <span>
                    Страница {page} из {totalPages}
                </span>
                <button
                    onClick={plusPage}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded bg-gray disabled:opacity-50"
                >
                    Вперед
                </button>
            </div>
        </>
    )
}

export default UserProducts
