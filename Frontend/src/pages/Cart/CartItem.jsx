import React from 'react'

const CartItem = ({ item }) => {
    return (
        <li>
            <p className="text-light-gray ">
                {new Date(item.post_time).toLocaleDateString()}
            </p>
        </li>
    )
}

export default CartItem
