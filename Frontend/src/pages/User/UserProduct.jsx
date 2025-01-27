import React from 'react'
import { Link } from 'react-router-dom'
import { nanoTonToTon, tonToNanoTon } from '../../utils/tonConversion'
import InfoBox from '../../components/InfoBox'
import arrowDown from '../../assets/chevron-down-gray.svg'
import star from '../../assets/star.svg'
import Arrow from '../../assets/Arrow.svg'
import Ton from '../../assets/ton_symbol.svg'

const UserProduct = ({ product }) => {
    return (
        <Link
            to={`/channels/${product.product_id}`}
            key={product.product_id}
            className="bg-card-white  shadow-card basis-1/3 p-8 rounded-3xl"
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
                    {/* <div className="flex">
                                <p className=" text-base border-2 border-gray rounded-full px-3 max-sm:text-xs">
                                    {product.category_name}
                                </p>
                            </div> */}
                </div>
                <div className="aspect-square">
                    <img
                        src={`/api/channel_${product.channel_tg_id}.png`}
                        alt={product.title}
                        className="rounded-full max-h-[111px]"
                    />
                </div>
            </div>
            <div className="bg-gray w-full h-[1px] my-8"></div>
            {/* <p className="text-base mb-3 max-sm:text-xs">
                        Время публикации:
                    </p>
                    <div className="flex justify-between gap-4">
                        <div className="relative w-full text-center">
                            <button
                                onClick={(e) =>
                                    handleButtonClick(e, () =>
                                        setIsOpenFormat(!isOpenFormat)
                                    )
                                }
                                className="flex justify-between items-center w-full p-3 border-2 rounded-full border-gray text-gray hover:border-gray-400 transition-all duration-200"
                            >
                                <p className="flex-grow text-left">
                                    {firstFormatName}
                                </p>
                                <img
                                    src={arrowDown}
                                    alt="Toggle"
                                    className={`transform transition-transform duration-300 ${isOpenFormat ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpenFormat ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <ul className="bg-white shadow-lg rounded-md overflow-hidden mt-1 z-50">
                                    {product.format_names.map(
                                        (format, index) => (
                                            <li
                                                key={index}
                                                className="p-2 hover:text-gray cursor-pointer transition-all"
                                                onClick={() => {
                                                    console.log(format)
                                                    setIsOpenFormat(false)
                                                }}
                                            >
                                                {format}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="relative w-full text-center">
                            <button
                                onClick={(e) =>
                                    handleButtonClick(e, () =>
                                        setIsOpenPostTime(!isOpenPostTime)
                                    )
                                }
                                className="flex justify-between items-center w-full p-3 border-2 rounded-full border-gray text text-gray hover:border-gray-400 transition-all duration-200"
                            >
                                <p className="flex-grow text-left">
                                    {firstPostTime}
                                </p>
                                <img
                                    src={arrowDown}
                                    alt="Toggle"
                                    className={`transform transition-transform duration-300 ${isOpenPostTime ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpenPostTime ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <ul className="bg-white shadow-lg rounded-md overflow-hidden mt-1 z-50">
                                    {product.post_times.map((time, index) => (
                                        <li
                                            key={index}
                                            className="p-2 hover:text-gray cursor-pointer transition-all"
                                            onClick={() => {
                                                console.log(time)
                                                setIsOpenPostTime(false)
                                            }}
                                        >
                                            {time.slice(0, 5)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div> */}
            {/* 
                    <div className="bg-gray w-full h-[1px] my-8"></div> */}
            <div>
                <p className="text-base max-sm:text-xs">Статистика</p>
                <InfoBox product={product} />
            </div>
            <div className="bg-gray w-full h-[1px] my-8"></div>
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
                    {/* <h2 className="text-3xl">{product.price} ₽</h2> */}
                </div>
                <div className="bg-blue rounded-2xl flex items-center">
                    <div className="px-4 py-3 text-xl text-white flex items-center gap-2">
                        <img src={Arrow} alt="" />
                        <p className="text-base font-normal">Начать сейчас</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserProduct
