import React from 'react'
import { nanoTonToTon } from '../../utils/tonConversion'
import { useUserStore } from '../../store'
import Ton from '../../assets/ton_symbol.svg'

const ReferralCount = () => {
    const { referral } = useUserStore()
    return (
        <div className="flex justify-between items-center p-2 gap-2">
            <div className="bg-blue p-2 rounded-xl text-center items-center h-12">
                <p className="text-base text-white">
                    Рефералов: {referral.countReferral}
                </p>
            </div>
            <div className="bg-blue p-2 rounded-xl flex gap-2 text-center items-center h-full">
                <p className="text-base text-white">
                    Заработок: {nanoTonToTon(referral.turnover)}
                </p>
                <img src={Ton} alt="" className="h-[2em] object-contain" />
            </div>
        </div>
    )
}

export default ReferralCount
