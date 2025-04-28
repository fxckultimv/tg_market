import { div } from 'framer-motion/client'
import React from 'react'
import { nanoTonToTon, tonToNanoTon } from '../utils/tonConversion'

const Balance = ({ balance }) => {
    return (
        <div className="flex">
            <p className=" border-2 border-blue rounded-xl p-2 text-base">
                Баланс: {nanoTonToTon(balance).toFixed(2)} Ton
            </p>
        </div>
    )
}

export default Balance
