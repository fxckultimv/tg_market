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
import { tonToNanoTon } from '../utils/tonConversion'
import { useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { initDataRaw } from '@telegram-apps/sdk-react'

const Ton = () => {
    const { initData, topUpBalance, handleWithdrawal, fetchBalance, balance } =
        useUserStore()
    const { addToast } = useToast()
    const languageCode = initData.raw?.result?.user?.languageCode || 'en'
    const userFriendlyAddress = useTonAddress()
    const rawAddress = useTonAddress(false)
    const wallet = useTonWallet()
    const [amount, setAmount] = useState('')
    const [amountWithdrawal, setAmountWithdrawal] = useState('')
    const [useConnectedWallet, setUseConnectedWallet] = useState(true)
    const [customAddress, setCustomAddress] = useState('')

    const [tonConnectUI, setOptions] = useTonConnectUI()
    useEffect(() => {
        setOptions({ language: languageCode })
    }, [])

    const handleTransaction = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0.01) {
            addToast('Введите корректную сумму.', 'error')
            return
        }

        if (wallet.account.chain === CHAIN.MAINNET) {
            addToast('Подключите TestNet кошелёк.', 'error')
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
                initDataRaw(),
                tonToNanoTon(amount),
                userFriendlyAddress,
                transactionResponse.boc
            )

            fetchBalance(initDataRaw())
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

        const addressToUse = useConnectedWallet
            ? userFriendlyAddress
            : customAddress.trim()

        if (!addressToUse) {
            addToast('Введите адрес кошелька для вывода.', 'error')
            return
        }

        if (wallet.account.chain === CHAIN.MAINNET) {
            addToast('Подключите TestNet кошелёк.', 'error')
            return
        }

        try {
            await handleWithdrawal(
                initDataRaw(),
                tonToNanoTon(amountWithdrawal),
                addressToUse
            )
            fetchBalance(initDataRaw())
            addToast('Деньги выведены')
            setAmountWithdrawal('')
            setCustomAddress('')
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error)
            addToast('Ошибка при выводе денег', 'error')
            setAmountWithdrawal('')
        }
    }

    return (
        <>
            <div className="flex justify-between m-2">
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
                <TonConnectButton />
            </div>

            {wallet && wallet.account.chain === CHAIN.MAINNET && balance && (
                <>
                    <div className="flex justify-between items-center m-2 gap-1">
                        {/* Кнопка для отправки транзакции */}
                        <input
                            type="number"
                            min={0.1}
                            placeholder="Введите сумму"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border p-2 rounded-lg min-w-10 text-black w-2/3"
                        />
                        <button
                            onClick={handleTransaction}
                            className="bg-blue rounded-xl p-2 w-1/3"
                        >
                            <p className="text-white">Пополнить</p>
                        </button>
                    </div>
                    {/* Вывод */}
                    <div className="m-2 flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                min={0.1}
                                placeholder="Введите сумму"
                                value={amountWithdrawal}
                                onChange={(e) =>
                                    setAmountWithdrawal(e.target.value)
                                }
                                className="border p-2 rounded-lg text-black w-2/3"
                            />
                            <button
                                onClick={Withdrawal}
                                className="bg-blue rounded-xl p-2 w-1/3"
                            >
                                <p className="text-white">Вывести</p>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={useConnectedWallet}
                                onChange={() =>
                                    setUseConnectedWallet(!useConnectedWallet)
                                }
                            />
                            <label>Вывести на привязанный кошелёк</label>
                        </div>

                        {!useConnectedWallet && (
                            <input
                                type="text"
                                placeholder="Введите адрес кошелька"
                                value={customAddress}
                                onChange={(e) =>
                                    setCustomAddress(e.target.value)
                                }
                                className="border p-2 rounded-lg text-black w-full"
                            />
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default Ton
