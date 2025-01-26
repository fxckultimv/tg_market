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

    if (!myProducts || myProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-4">
                <div className="text-xl text-red-500">Продуктов пока нету</div>
                <Link
                    to={'/create-ad'}
                    className="bg-blue text-white m-2 p-1 rounded-lg"
                >
                    Добавить продукт
                </Link>
            </div>
        )
    }

    return (
        <div className="basis-2/3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
