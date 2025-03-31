import React from 'react'
import { useUserStore } from '../../store'
import { nanoTonToTon } from '../../utils/tonConversion'

const ReferralPayments = () => {
    const { referral } = useUserStore()

    return (
        <div className="p-4 min-w-full ">
            <h2 className="text-xl mb-4">Выплаты</h2>
            <div className="flex flex-col gap-3 max-md:gap-2 min-w-max">
                {referral.payments.map((payment) => (
                    <div
                        key={payment.id}
                        className="flex justify-around items-center bg-card-white text-center rounded-xl min-w-max p-2"
                    >
                        <p className="p-2 border-r">{payment.id}</p>
                        <p className="p-2">
                            {nanoTonToTon(payment.partner_commission)} Ton
                        </p>
                        <p className="p-2">
                            {new Date(payment.created_at).toLocaleString(
                                'ru-RU',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReferralPayments
