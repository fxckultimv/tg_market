import React, { useEffect } from 'react'
import { mainButton } from '@telegram-apps/sdk-react'

const MainButtonTest = () => {
    useEffect(() => {
        // Проверка доступности метода
        if (
            !mainButton.setParams.isAvailable() ||
            !mainButton.onClick.isAvailable()
        ) {
            console.warn('mainButton недоступен. Запусти в Telegram WebApp.')
            return
        }

        // Установка параметров кнопки
        mainButton.setParams({
            text: 'Нажми меня',
            isVisible: true,
            isEnabled: true,
            backgroundColor: '#22C55E',
            textColor: '#ffffff',
        })

        // Назначение обработчика
        const off = mainButton.onClick(() => {
            console.log('MainButton нажата ✅')
            alert('Кнопка нажата! 🎉')
        })

        // Отписка при размонтировании
        return () => {
            if (typeof off === 'function') {
                off()
            }
        }
    }, [])

    return (
        <div style={{ padding: 20, textAlign: 'center' }}>
            <h2>Тест MainButton</h2>
            <p>Нажми кнопку снизу в Telegram</p>
        </div>
    )
}

export default MainButtonTest
