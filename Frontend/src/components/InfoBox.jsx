import React from 'react'
import user from '../assets/subscribers-black.svg'
import view from '../assets/view-black.svg'
import { nanoTonToTon, tonToNanoTon } from '../utils/tonConversion'

const InfoBox = ({ product }) => (
    <div className="flex justify-between gap-3 w-full ">
        <div className="bg-info-box flex flex-col justify-center items-center w-1/4 px-6 py-2 rounded-xl gap-2 max-md:px-2">
            <img src={user} alt="" className="min-h-[24px]" />
            <p className="text-white text-sm bg-blue px-1 py-[2px] rounded-sm flex justify-center items-center max-md:text-xs">
                {product.subscribers_count}
            </p>
        </div>
        <div className="bg-info-box flex flex-col justify-center items-center w-1/4 px-6 py-2 rounded-xl gap-2 max-md:px-2">
            <img src={view} alt="" className="min-h-[24px]" />
            <p className="text-white text-sm bg-blue px-1 py-[2px] rounded-sm flex justify-center items-center max-md:text-xs">
                {Math.round(product.views)}
            </p>
        </div>
        <div className="bg-info-box flex flex-col justify-center items-center w-1/4 px-6 py-2 rounded-xl gap-2 max-md:px-2 max-md:text-xs">
            <h2 className="">ER</h2>
            <p className="text-white text-sm bg-blue px-1 py-[2px] rounded-sm flex justify-center items-center max-md:text-xs">
                {((100 / product.subscribers_count) * product.views).toFixed(1)}
                %
            </p>
        </div>
        {product.price && product.views && (
            <div className="bg-info-box flex flex-col justify-center items-center w-1/4 px-6 py-2 rounded-xl gap-2 max-md:px-2 max-md:text-xs">
                <h2 className="">CPV</h2>
                <div className="bg-blue rounded-sm flex justify-center items-center">
                    <p className="text-white text-sm px-1 py-[2px] max-md:text-xs">
                        {Math.round(
                            nanoTonToTon(product.price) / product.views
                        )}
                        ton
                    </p>
                </div>
            </div>
        )}
    </div>
)
export default InfoBox
