import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store'

const Setting = () => {
    const [theme, setTheme] = useState('dark') // Тема по умолчанию - тёмная
    const [language, setLanguage] = useState('ru') // Язык по умолчанию - русский

    // Переключатель темы
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
        document.body.className =
            theme === 'dark' ? 'bg-dark-gray text-white' : 'bg-white text-black'
    }

    // Изменение языка
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value)
        // Здесь можно добавить логику по изменению языка в приложении
    }

    return (
        <div
            className={`flex flex-col  justify-start min-h-screen ${
                theme === 'dark'
                    ? 'bg-dark-gray text-white'
                    : 'bg-white text-black'
            } m-2`}
        >
            <h2 className="text-3xl font-bold mb-6">Настройки</h2>

            {/* Переключатель темы */}
            <div className="mb-4">
                <label className="mr-2">Тема сайта:</label>
                <button
                    onClick={toggleTheme}
                    className="bg-accent-green text-white px-4 py-2 rounded transition-transform transform hover:scale-105"
                >
                    {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                </button>
            </div>

            {/* Выбор языка */}
            <div className="mb-6">
                <label className="mr-2">Язык сайта:</label>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="bg-medium-gray text-white px-4 py-2 rounded"
                >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    {/* Добавь другие языки по мере необходимости */}
                </select>
            </div>
        </div>
    )
}

export default Setting
