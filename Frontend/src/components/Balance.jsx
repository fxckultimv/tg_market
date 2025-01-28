import { div } from 'framer-motion/client'
import React from 'react'
import { nanoTonToTon, tonToNanoTon } from '../utils/tonConversion'

const Balance = ({ balance }) => {
    return (
        <div className="flex">
            <p className=" border-2 border-green rounded-xl p-2 text-base">
                Баланс: {nanoTonToTon(balance)} Ton
            </p>
        </div>
    )
}

export default Balance
