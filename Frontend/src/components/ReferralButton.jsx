import React from 'react'
import { initData, shareMessage } from '@telegram-apps/sdk-react'

const ReferralButton = () => {
    const sendReferral = async () => {
        if (!shareMessage.isAvailable()) {
            alert('Функция недоступна в этом клиенте')
            return
        }

        const userId = initData.user().id
        console.log(userId)

        if (!userId) {
            alert('Пользователь не найден')
            return
        }

        // Твоя реферальная ссылка, например: https://t.me/YourBot?start=ref_USERID
        const referralLink = `https://t.me/Meta_Stock_Market_bot?start=ref_${userId}`

        const message = `bbhjSYgvck23`
        console.log(message)

        try {
            await shareMessage(message)
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err)
        }
    }

    return (
        <button onClick={sendReferral}>📤 Отправить реферальную ссылку</button>
    )
}

export default ReferralButton
