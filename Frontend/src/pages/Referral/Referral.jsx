import React from 'react'
import ReferralCount from './ReferralCount'
import ReferralPayments from './ReferralPayments'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import Loading from '../../Loading'
import Error from '../../Error'
import { useState } from 'react'
import Copy from '../../assets/copy.svg?react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

const Referral = () => {
    const { user, referral, handleReferral, error, loading } = useUserStore()
    const [copied, setCopied] = useState(false)
    const [copyModal, setCopyModal] = useState(false)

    const handleCopy = () => {
        const link = `https://t.me/Meta_Stock_Market_bot?start=ref_${user.user_uuid}`
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true)
                setCopyModal(true)
                setTimeout(
                    () => {
                        setCopied(false)
                        setCopyModal(false)
                    },

                    2000
                )
            })
            .catch(() => {
                alert('Не удалось скопировать ссылку')
            })
    }

    useEffect(() => {
        handleReferral(initDataRaw())
    }, [])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error />
    }

    if (!referral || !referral.payments || referral.payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <div
                    className="bg-background border-[1px] border-gray rounded-xl p-2 flex items-center"
                    onClick={handleCopy}
                >
                    <p className="text-gray text-xs truncate">{`https://t.me/Banana_Star_Server_bot?start=re...`}</p>
                    <Copy className="text-white" />
                </div>
                <p className="text-base ">
                    У вас нету выплат по реферальной системе
                </p>

                <AnimatePresence>
                    {copyModal && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue text-white px-4 py-2 rounded-xl text-sm z-50 shadow-lg"
                        >
                            Ссылка скопирована
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4">
                <div
                    className="bg-background border-[1px] border-gray rounded-xl p-2 flex items-center"
                    onClick={handleCopy}
                >
                    <p className="text-gray text-xs truncate">{`https://t.me/Banana_Star_Server_bot?start=re...`}</p>
                    <Copy className="text-white" />
                </div>
                <AnimatePresence>
                    {copyModal && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue text-white px-4 py-2 rounded-xl text-sm z-50 shadow-lg"
                        >
                            Ссылка скопирована
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <ReferralCount />
            <ReferralPayments />
        </>
    )
}

export default Referral
