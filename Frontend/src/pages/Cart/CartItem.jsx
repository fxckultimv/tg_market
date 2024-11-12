import React from 'react'

const CartItem = ({ item }) => {
    return (
        <li className="p-2 bg-white rounded-md">
            <p className="">{new Date(item.post_time).toLocaleDateString()}</p>
        </li>
    )
}

export default CartItem
