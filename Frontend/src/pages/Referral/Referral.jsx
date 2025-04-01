import React from 'react'
import ReferralCount from './ReferralCount'
import ReferralPayments from './ReferralPayments'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import Loading from '../../Loading'
import Error from '../../Error'
import { useState } from 'react'

const Referral = () => {
    const { user, referral, handleReferral, error, loading } = useUserStore()
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const link = `https://t.me/Meta_Stock_Market_bot?start=ref_${user.user_uuid}`
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
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
                <p className="text-2xl ">
                    У вас нету выплат по реферальной системе
                </p>
                <button
                    onClick={handleCopy}
                    className="p-2 bg-blue rounded-xl text-black"
                >
                    Ваша ссылка
                </button>
            </div>
        )
    }

    return (
        <>
            <ReferralCount />
            <ReferralPayments />
        </>
    )
}

export default Referral
