import React from 'react'

const ProductCart = ({ order }) => {
    return (
        <div
            key={order.order_id}
            className="bg-gradient-to-r from-dark-gray to-medium-gray p-4 rounded-xl shadow-2xl text-white flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out"
        >
            <div className="flex-1 mr-4">
                <h3 className="text-xl font-extrabold mb-2 text-main-green">
                    {order.title}
                </h3>
                <p className="text-light-gray mb-2">{order.status}</p>
                {/* <p>⭐️{channel.rating}</p> */}
                {/* <p className="font-semibold text-main-green mb-2">
                                Подписчики: {channel.subscribers_count}
                            </p> */}
                {/* <p className="text-main-gray mb-2">
                                Дата публикации:{' '}
                                {new Date(
                                    product.post_time
                                ).toLocaleDateString()}
                            </p> */}
                <p className="text-main-gray">
                    От: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="font-bold text-2xl text-accent-green">
                    {order.total_price}₽
                </p>
            </div>

            <div className="flex-shrink-0">
                <img
                    className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                    src={`http://localhost:5000/channel_${order.channel_tg_id}.png`}
                    alt={order.channel_name}
                />
            </div>
        </div>
    )
}

export default ProductCart
