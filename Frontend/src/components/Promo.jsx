import React from 'react'
import { useState } from 'react'
import { useUserStore } from '../store'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { useToast } from './ToastProvider'
import { useTranslation } from 'react-i18next'

const Promo = () => {
    const { activatePromo, loading, error } = useUserStore()
    const { t } = useTranslation('Promo')
    const { addToast } = useToast()
    const [code, setCode] = useState('')

    const activate = async () => {
        try {
            await activatePromo(initDataRaw(), code)
            setCode('')
            addToast(t('success'))
        } catch (err) {
            addToast(t('error'), 'error')
            console.log('Ошибка активации промокода', error)
            setCode('')
        }
    }

    return (
        <div className="flex justify-between p-2 gap-2">
            <input
                type="text"
                placeholder={t('placeholder')}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-black rounded-lg p-2 min-w-0"
            />{' '}
            <button
                className="bg-blue border rounded-lg p-2"
                onClick={activate}
            >
                {t('activate')}
            </button>
        </div>
    )
}

export default Promo
