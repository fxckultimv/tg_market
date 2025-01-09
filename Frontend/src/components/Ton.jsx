import React from 'react'
import {
    useTonAddress,
    useTonConnectUI,
    useTonWallet,
    TonConnectButton,
    CHAIN,
} from '@tonconnect/ui-react'
import { useUserStore } from '../store'
import { useEffect } from 'react'

const Ton = () => {
    const { initData } = useUserStore()
    const languageCode = initData?.result?.user?.languageCode || 'en'

    const userFriendlyAddress = useTonAddress()
    const rawAddress = useTonAddress(false)

    const wallet = useTonWallet()

    const [tonConnectUI, setOptions] = useTonConnectUI()
    useEffect(() => {
        setOptions({ language: languageCode })
    }, [])

    // Объект с данными для транзакции
    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // Срок действия - 60 сек
        messages: [
            {
                address: '0QDHqPLXVrZvdbH-RzSgLFgPokwqLLU78Jbsq8pgPV3LOZdY', // адрес получателя
                amount: '50000000', // сумма в нанотонах (например, 0.02 TON)
                // опционально: stateInit, payload и другие параметры
            },
        ],
    }
    return (
        <>
            <div className="flex justify-center m-2">
                <TonConnectButton />
            </div>

            <div className="flex justify-between items-center ">
                <div
                    className={`p-3 m-2 rounded-xl ${
                        wallet
                            ? wallet.account.chain === CHAIN.MAINNET
                                ? 'bg-green'
                                : 'bg-red'
                            : 'bg-gray-300'
                    }`}
                >
                    {wallet
                        ? wallet.account.chain === CHAIN.MAINNET
                            ? 'MainNet'
                            : 'TestNet'
                        : 'N/A'}
                </div>
                {/* Кнопка для отправки транзакции */}
                <button
                    onClick={() => tonConnectUI.sendTransaction(myTransaction)}
                    className="bg-blue rounded-xl m-2 p-3"
                >
                    Send transaction
                </button>
            </div>
        </>
    )
}

export default Ton
