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
import { useLaunchParams } from '@tma.js/sdk-react'
import { useToast } from '../components/ToastProvider'

const Ton = () => {
    const { topUpBalance, handleWithdrawal, fetchBalance } = useUserStore()
    const { initDataRaw } = useLaunchParams()
    const { addToast } = useToast()
    const languageCode = initDataRaw?.result?.user?.languageCode || 'en'

    const userFriendlyAddress = useTonAddress()
    const rawAddress = useTonAddress(false)

    const wallet = useTonWallet()
    const [amount, setAmount] = useState('')
    const [amountWithdrawal, setAmountWithdrawal] = useState('')

    const [tonConnectUI, setOptions] = useTonConnectUI()
    useEffect(() => {
        setOptions({ language: languageCode })
    }, [])

    const handleTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0.01) {
            addToast('Введите корректную сумму.', 'error')
            return
        }

        // if (wallet.account.chain === CHAIN.TESTNET) {
        //     addToast('Подключите MainNet кошелёк.', 'error')
        //     return
        // }

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
            await topUpBalance(
                initDataRaw,
                tonToNanoTon(amount),
                userFriendlyAddress,
                transactionResponse.boc
            )

            fetchBalance(initDataRaw)
            addToast('Баланс пополнен')
            setAmount('')
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error)
            addToast('Ошибка при пополнении', 'error')
            setAmount('')
        }
    }

    const Withdrawal = async () => {
        if (
            !amountWithdrawal ||
            isNaN(amountWithdrawal) ||
            Number(amountWithdrawal) <= 0.01
        ) {
            addToast('Введите корректную сумму.', 'error')
            return
        }

        // if (wallet.account.chain === CHAIN.TESTNET) {
        //     addToast('Подключите MainNet кошелёк.', 'error')
        //     return
        // }

        try {
            handleWithdrawal(
                initDataRaw,
                tonToNanoTon(amountWithdrawal),
                userFriendlyAddress
            )
            addToast('Деньги выведены')
            setAmountWithdrawal('')
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error)
            addToast('Ошибка при выводе денег', 'error')
            setAmountWithdrawal('')
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
                    min={0.1}
                    placeholder="Введите сумму"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border p-2 rounded-lg min-w-10  text-black"
                />
                <button
                    onClick={handleTransaction}
                    className="bg-blue rounded-xl p-3"
                >
                    Пополнить
                </button>
            </div>
            <div className="flex justify-between items-center m-2 gap-1">
                {/* Кнопка для вывода ton */}
                <input
                    type="number"
                    min={0.1}
                    placeholder="Введите сумму"
                    value={amountWithdrawal}
                    onChange={(e) => setAmountWithdrawal(e.target.value)}
                    className="border p-2 rounded-lg min-w-10  text-black"
                />
                <button onClick={Withdrawal} className="bg-blue rounded-xl p-3">
                    Вывести
                </button>
            </div>
        </>
    )
}

export default Ton
