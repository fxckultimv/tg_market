import React from 'react'

const CartItem = ({ item }) => {
    return (
        <li>
            <p className="text-gray-400 ">
                {new Date(item.post_time).toLocaleDateString()}
            </p>
        </li>
    )
}

export default CartItem
