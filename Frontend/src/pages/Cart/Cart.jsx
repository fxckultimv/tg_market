import { useLaunchParams } from '@tma.js/sdk-react'
import React, { useEffect } from 'react'
import { useUserStore } from '../../store'
import { Link } from 'react-router-dom'
import Loading from '../../Loading'
import Bag from '../../assets/bag.svg'
import CartItem from './CartItem'

const Cart = () => {
    const { initDataRaw } = useLaunchParams()
    const { cart, fetchCart, loading, error } = useUserStore()

    useEffect(() => {
        fetchCart(initDataRaw)
    }, [initDataRaw, fetchCart])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }

    if (!cart || !cart.products || Object.keys(cart.products).length === 0) {
        return (
            <div className="h-max flex flex-col justify-center gap-3 items-center">
                <div className="text-2xl font-bold mb-4">
                    Ваша корзина пуста
                </div>

                <Link
                    to="/channels"
                    className="bg-blue px-6 py-3 rounded-xl text-lg transition-transform transform hover:scale-105"
                >
                    Перейти к товарам
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3 m-16">
                <div className="p-4 bg-blue rounded-2xl">
                    <img src={Bag} alt="Документ" className="h-[32px]" />
                </div>
                <div className="flex">
                    <h1 className="text-black text-5xl max-md:text-3xl">
                        Корзина
                    </h1>
                    <p>{Object.keys(cart.products).length}</p>
                </div>
            </div>
            <div className="flex justify-between p-16 max-md:p-5 max-xl:p-8 max-md:flex-col gap-3">
                <CartItem cart={cart} />
            </div>
        </>
    )
}

export default Cart
