import React from 'react'
import { Link } from 'react-router-dom'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import { log10 } from 'chart.js/helpers'

const ProductCart = ({ order }) => {
    return (
        <div
            to={`/buy/${order.order_id}`}
            key={order.order_id}
            className="bg-card-white flex flex-col justify-center p-8 h-full rounded-xl"
        >
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl mb-2">{order.title}</h3>
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
                <div className="flex items-center gap-2">
                    <img src={Ton} alt="" className="h-[2em]" />
                    <p className="text-2xl">
                        {nanoTonToTon(order.total_price)} Ton
                    </p>
                </div>
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
