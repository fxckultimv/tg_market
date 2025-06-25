import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../../store'
import i18n from '../../i18n'
import { useTranslation } from 'react-i18next'

const Setting = () => {
    const { t } = useTranslation('Setting')
    const [theme, setTheme] = useState('dark') // Тема по умолчанию - тёмная
    const [language, setLanguage] = useState('ru') // Язык по умолчанию - русский
    const { course, setCourse } = useUserStore()

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)
        document.body.classList.add(savedTheme)

        const savedLang = localStorage.getItem('language')
        if (savedLang) {
            setLanguage(savedLang)
            i18n.changeLanguage(savedLang)
        }
    }, [])

    // Переключатель темы с сохранением в localStorage
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.body.classList.remove(theme) // Удаляем старую тему
        document.body.classList.add(newTheme) // Добавляем новую тему
    }

    // Обработчик изменения языка
    const handleLanguageChange = (e) => {
        const selectedLang = e.target.value
        setLanguage(selectedLang)
        i18n.changeLanguage(selectedLang)
        localStorage.setItem('language', selectedLang)
    }

    const handleUserCourse = (e) => {
        localStorage.setItem('userCourse', e.target.value)
        setCourse(e.target.value)
    }

    return (
        <div
            className={`flex flex-col items-start min-h-screen px-6 py-4 bg-background text-text`}
        >
            <h2 className="text-3xl font-bold mb-8">{t('title')}</h2>

            {/* Переключатель темы */}
            <div className="mb-6">
                <label className="mr-4 font-medium">{t('themeLabel')}</label>
                <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-text ${
                        theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {theme === 'dark'
                        ? `${t('lightTheme')}`
                        : `${t('darkTheme')}`}
                </button>
            </div>

            {/* Выбор языка */}
            <div className=" mb-6">
                <label className="mr-4 font-medium">{t('languageLabel')}</label>
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-4 py-2 rounded-lg font-semibold bg-background text-text border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div className=" mb-6">
                <label className="mr-4 font-medium">{t('currencyLabel')}</label>
                <select
                    value={course}
                    onChange={handleUserCourse}
                    className="px-4 py-2 rounded-lg font-semibold bg-background text-text border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="rub">RUB</option>
                    <option value="eur">EUR</option>
                    <option value="usd">USD</option>
                    <option value="uah">UAH</option>
                    <option value="cny">CNY</option>
                </select>
            </div>

            {/* <Link to="/rules" className="text-blue hover:underline">
                Правила пользования
            </Link> */}

            {/* Добавить ссылку для возврата на предыдущую страницу */}
            <Link to="/" className="text-blue hover:underline">
                {t('backToMain')}
            </Link>
        </div>
    )
}

export default Setting
