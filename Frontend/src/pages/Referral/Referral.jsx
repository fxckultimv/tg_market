import React from 'react'
import ReferralCount from './ReferralCount'
import ReferralPayments from './ReferralPayments'
import { useUserStore } from '../../store'
import { useEffect } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import Loading from '../../Loading'
import Error from '../../Error'

const Referral = () => {
    const { referral, handleReferral, error, loading } = useUserStore()

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
        return <div>Нет выплат</div>
    }

    return (
        <>
            <ReferralCount />
            <ReferralPayments />
        </>
    )
}

export default Referral
