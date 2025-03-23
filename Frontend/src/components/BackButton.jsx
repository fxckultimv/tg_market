import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { backButton } from '@telegram-apps/sdk-react'

/**
 * Универсальный компонент для обработки кнопки "Назад" в Telegram Web Apps.
 */
const BackButton = () => {
    const navigate = useNavigate()

    useEffect(() => {
        backButton.show()

        // Добавляем обработчик клика по кнопке "Назад"
        const handleBackClick = () => {
            navigate(-1) // Переход на предыдущую страницу
        }

        backButton.onClick(handleBackClick)

        return () => {
            backButton.hide()
            backButton.offClick(handleBackClick) // Очищаем обработчик при размонтировании
        }
    }, [navigate])

    return null // Компонент не рендерит UI, он управляет кнопкой Telegram
}

export default BackButton
