import React from 'react'
import { Link } from 'react-router-dom'
import { nanoTonToTon } from '../../utils/tonConversion'
import InfoBox from '../../components/InfoBox'
import star from '../../assets/star.svg'
import Ton from '../../assets/ton_symbol.svg'

const UserProduct = ({ product }) => {
    return (
        <Link
            to={`/channels/${product.product_id}`}
            key={product.product_id}
            className="bg-card-white  shadow-card basis-1/3 p-4 rounded-3xl"
        >
            <div className="flex justify-between">
                <div className="flex flex-col gap-4">
                    <h2 className=" text-2xl max-md:text-lg">
                        {product.title}
                    </h2>
                    <div className="flex gap-2 items-center">
                        <img src={star} alt="" />
                        <p className=" text-base max-sm:text-xs">
                            {product.rating}
                        </p>
                    </div>
                </div>
                <div className="aspect-square">
                    <img
                        src={`http://localhost:5000/channel_${product.channel_tg_id}.png`}
                        alt={product.title}
                        className="rounded-full max-h-[111px]"
                    />
                </div>
            </div>
            <div className="bg-gray w-full h-[1px] my-2"></div>
            <div>
                <p className="text-base max-sm:text-xs">Статистика</p>
                <InfoBox product={product} />
            </div>
            <div className="bg-gray w-full h-[1px] my-2"></div>
            <p className="max-sm:text-xs">Стоимость:</p>
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <img
                            src={Ton}
                            alt=""
                            className="h-[2em] w-auto inline-block align-middle"
                            style={{ verticalAlign: 'middle' }}
                        />
                        <p className="text-3xl max-md:text-xl ">
                            {nanoTonToTon(product.price)} Ton
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserProduct
