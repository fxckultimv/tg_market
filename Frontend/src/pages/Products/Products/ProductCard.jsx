import React from 'react'
import { nanoTonToTon, tonToNanoTon } from '../../../utils/tonConversion'
import Ton from '../../../assets/ton_symbol.svg'

const ProductCard = ({ product }) => {
    return (
        <div
            key={product.product_id}
            className="bg-card-white flex flex-col justify-center p-8 h-full rounded-xl"
        >
            <div className="flex justify-between">
                <div className="flex flex-col gap-2 max-w-[60%] break-words">
                    <h2 className="text-2xl">{product.title}</h2>
                </div>
                <div className="aspect-square">
                    <img
                        src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                        alt={product.title}
                        className="rounded-full max-h-[111px]"
                    />
                </div>
            </div>
            <div className="bg-gray w-full h-[1px] my-8"></div>
            <div>
                <p className="">
                    От: {new Date(product.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                    <img src={Ton} alt="" className="h-[2em]" />
                    <p className="text-2xl">
                        {nanoTonToTon(product.price)} Ton
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
