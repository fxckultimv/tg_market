import React from 'react'
import Ton from '../assets/ton_symbol.svg'
import CryptoBot from '../assets/CryptoBot.png'

const TonModal = ({
    handleTransaction,
    handleCreateInvoice,
    setShowModal,
    amount,
}) => {
    const closeModal = () => {
        return setShowModal(false)
    }
    return (
        <div
            className="z-50 fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center"
            onClick={closeModal}
        >
            <div
                className="bg-background p-6 rounded-xl z-60 flex flex-col"
                onClick={(e) => e.stopPropagation()} // <<< критично!
            >
                <h2 className="items-center text-lg font-bold mb-4">
                    Выберите способ оплаты
                </h2>
                <button
                    onClick={handleTransaction}
                    className="bg-blue hover:bg-blue-700 text-white p-2 rounded-xl w-full mb-2 flex gap-2 justify-center items-center"
                >
                    Wallet <img src={Ton} alt="" className="h-7" />
                </button>
                <button
                    onClick={async () => {
                        const data = await handleCreateInvoice()
                        if (data?.payLinkMiniApp) {
                            window.location.href = data.payLinkMiniApp
                        }
                    }}
                    className="bg-blue hover:bg-gray-700 text-white p-2 rounded-xl w-full flex gap-2 justify-center items-center"
                >
                    CryptoBot <img src={CryptoBot} alt="" className="h-7" />
                </button>
            </div>
        </div>
    )
}

export default TonModal
