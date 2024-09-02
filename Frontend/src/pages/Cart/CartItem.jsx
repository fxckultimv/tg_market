import React from 'react'

const CartItem = ({ item, onSelect, isSelected }) => {
    return (
        <li
            onClick={() => onSelect(item)}
            className={`flex flex-col p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer transition duration-300 ${
                isSelected ? 'border-2 border-green-400' : 'hover:shadow-lg'
            }`}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-400">ID товара: {item.product_id}</p>
            </div>
            <p className="text-gray-400 mb-2">{item.description}</p>
            <div className="flex justify-between items-center">
                <p className="text-gray-400">
                    Цена:{' '}
                    <span className="font-semibold">{item.price} руб.</span>
                </p>
                <p className="text-gray-400">
                    Количество:{' '}
                    <span className="font-semibold">{item.quantity}</span>
                </p>
            </div>
            <p className="text-gray-400 mt-2">
                Время публикации:{' '}
                {new Date(item.post_time).toLocaleDateString()}
            </p>
        </li>
    )
}

export default CartItem
