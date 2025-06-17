import React from 'react'
import { useEffect } from 'react'
import QRCode from 'react-qr-code'

const telegramLink = 'https://t.me/carrot_ads_bot/Carrot'

const NoTelegram = () => {
    // App.jsx или index.js
    useEffect(() => {
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches
        const theme = prefersDark ? 'dark' : 'light'

        localStorage.setItem('theme', theme)
        document.body.classList.add(theme)
        console.log(theme)
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4 text-text">
            <h1 className="text-4xl md:text-5xl font-bold text-blue mb-4">
                Добро пожаловать в Carrot 🥕
            </h1>

            <p className="text-base md:text-lg max-w-md mb-6">
                Это биржа продажи рекламы в Telegram. Открывай приложение в
                Telegram, чтобы покупать и продавать рекламу в несколько кликов.
            </p>

            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <QRCode value={telegramLink} size={180} />
            </div>

            <a
                href={telegramLink}
                className="bg-blue hover:bg-orange-600 transition-colors text-white font-semibold py-3 px-6 rounded-full text-lg shadow-lg"
            >
                Открыть в Telegram
            </a>

            <p className="mt-6 text-xs">
                Открой на телефоне или отсканируй QR-код
            </p>
        </div>
    )
}

export default NoTelegram
