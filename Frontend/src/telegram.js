import {
    retrieveLaunchParams,
    isLaunchParamsRetrieveError,
} from '@telegram-apps/sdk-react'

export function detectTelegramEnvironment() {
    try {
        const params = retrieveLaunchParams()
        return !!params?.tgWebAppData
    } catch (err) {
        if (!isLaunchParamsRetrieveError(err)) {
            console.error('Ошибка определения Telegram:', err)
        }
        return false
    }
}
