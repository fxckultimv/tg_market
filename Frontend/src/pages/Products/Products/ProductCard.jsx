import React from 'react'

const ProductCard = ({ product }) => {
    return (
        <div
            key={product.product_id}
            className="bg-card-white p-4 rounded-xl shadow-2xl  flex justify-between items-center space-x-6 transform hover:scale-105 transition duration-300 ease-in-out"
        >
            <div className="flex-1 mr-4">
                <h3 className="text-xl font-extrabold mb-2 text-main-green">
                    {product.title}
                </h3>
                <p className=" mb-2">{product.status}</p>
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
                <p className="">
                    От: {new Date(product.created_at).toLocaleDateString()}
                </p>
                <p className="font-bold text-2xl text-accent-green">
                    {product.price}₽
                </p>
            </div>

            <div className="flex-shrink-0">
                <img
                    className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                    src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                    alt={product.channel_name}
                />
            </div>
        </div>
    )
}

export default ProductCard
