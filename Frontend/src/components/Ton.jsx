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
import { nanoTonToTon, tonToNanoTon } from '../utils/tonConversion'
import { useState } from 'react'

const Ton = () => {
    const { initData } = useUserStore()
    const languageCode = initData?.result?.user?.languageCode || 'en'

    const userFriendlyAddress = useTonAddress()
    const rawAddress = useTonAddress(false)

    const wallet = useTonWallet()
    const [amount, setAmount] = useState('')

    const [tonConnectUI, setOptions] = useTonConnectUI()
    useEffect(() => {
        setOptions({ language: languageCode })
    }, [])

    // Объект с данными для транзакции
    // const myTransaction = {
    //     validUntil: Math.floor(Date.now() / 1000) + 60, // Срок действия - 60 сек
    //     messages: [
    //         {
    //             address: '0QDHqPLXVrZvdbH-RzSgLFgPokwqLLU78Jbsq8pgPV3LOZdY', // адрес получателя
    //             amount: tonToNanoTon(amount).toString, // сумма в нанотонах (например, 0.02 TON)
    //             // опционально: stateInit, payload и другие параметры
    //         },
    //     ],
    // }

    const handleTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert('Введите корректную сумму.')
            return
        }

        const myTransaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // Срок действия - 60 сек
            messages: [
                {
                    address: 'EQBgW-Iz5T_hKaYgMnvTF5KATOjvOEtyhKjp_oloGlkZBfjq', // адрес получателя
                    amount: tonToNanoTon(amount).toString(), // переводим в нанотоны
                },
            ],
        }

        try {
            // Отправляем транзакцию через TonConnect UI
            const transactionResponse =
                await tonConnectUI.sendTransaction(myTransaction)
            console.log(transactionResponse)

            // Получаем хэш транзакции
            const { hash } = transactionResponse

            console.log('Транзакция успешна, хэш:', hash)
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error)
            alert('Произошла ошибка при отправке транзакции.')
        }
    }

    return (
        <>
            <div className="flex justify-between m-2">
                <TonConnectButton />
                <div
                    className={`px-4 py-3 text-base rounded-xl h-[40px] items-baseline ${
                        wallet
                            ? wallet.account.chain === CHAIN.MAINNET
                                ? 'bg-green'
                                : 'bg-red'
                            : 'bg-gray'
                    }`}
                >
                    {wallet
                        ? wallet.account.chain === CHAIN.MAINNET
                            ? 'MainNet'
                            : 'TestNet'
                        : 'N/A'}
                </div>
            </div>

            <div className="flex justify-between items-center m-2 gap-1">
                {/* Кнопка для отправки транзакции */}
                <input
                    type="number"
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 rounded-lg min-w-10"
                />
                <button
                    onClick={handleTransaction}
                    className="bg-blue rounded-xl p-3"
                >
                    Пополнить
                </button>
            </div>
        </>
    )
}

export default Ton
