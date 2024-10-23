import React from 'react'
import { useProductStore } from '../../../store'
import { useEffect } from 'react'
import { useBackButton, useLaunchParams } from '@tma.js/sdk-react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import Loading from '../../../Loading'
import Error from '../../../Error'

const Products = () => {
    const { initDataRaw } = useLaunchParams()
    const backButton = useBackButton()
    const { myProducts, fetchMyProducts, loading, error } = useProductStore()

    useEffect(() => {
        fetchMyProducts(initDataRaw)
    }, [initDataRaw, fetchMyProducts])

    useEffect(() => {
        const handleBackClick = () => {
            window.history.back()
        }

        if (backButton) {
            backButton.show()
            backButton.on('click', handleBackClick)

            return () => {
                backButton.hide()
                backButton.off('click', handleBackClick)
            }
        }
    }, [backButton])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    if (!myProducts) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray text-white">
                <div className="text-xl text-red-500">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-3xl font-extrabold text-main-green mb-4">
                Мои продукты
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {myProducts.map((product) => (
                    <Link to={product.product_id} key={product.product_id}>
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Products
