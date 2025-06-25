import React from 'react'
import { useTranslation } from 'react-i18next'

const HowCreate = () => {
    const { t } = useTranslation('CreateAd')
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="bg-card-white shadow-lg rounded-lg p-6 max-w-md text-center">
                <h2 className="text-2xl font-semibold text-text mb-4">
                    {t('howToAddTitle')}
                </h2>
                <p className="text-text mb-2">{t('howToAddStep1')}</p>
                <p className="text-text mb-2">{t('howToAddStep2')}</p>
                <p className="text-text mb-2">{t('howToAddStep3')}</p>
                <p className="text-text font-semibold mt-4">
                    {t('howToAddFinal')}
                </p>
            </div>
        </div>
    )
}

export default HowCreate
