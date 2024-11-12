import React from 'react'

const ProductCart = ({ order }) => {
    return (
        <div
            key={order.order_id}
            className="bg-card-white flex flex-col justify-center p-8 h-full rounded-xl"
        >
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-extrabold mb-2">
                        {order.title}
                    </h3>
                    <p className=" mb-2">{order.status}</p>
                </div>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px]"
                        src={`http://localhost:5000/channel_${order.channel_tg_id}.png`}
                        alt={order.channel_name}
                    />
                </div>

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
            </div>
            <div className="bg-gray w-full h-[1px] my-8"></div>
            <div>
                <p className="">
                    От: {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="font-bold text-2xl">{order.total_price}₽</p>
            </div>

            {/* <div className="flex-shrink-0">
                <img
                    className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                    src={`http://localhost:5000/channel_${order.channel_tg_id}.png`}
                    alt={order.channel_name}
                />
            </div> */}
        </div>
    )
}

export default ProductCart
