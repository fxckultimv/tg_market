/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'dark-gray': '#111827',
                'medium-gray': '#1f2937',
                'main-grey': '#6b7280',
                'light-gray': '#9ca3af',
                'main-green': 'var(--button-color)',
                'accent-green': '#22c55e',
                // Используем CSS-переменные
                'theme-bg': 'var(--bg-color)',
                'theme-button': 'var(--button-color)',
                'theme-button-text': 'var(--button-text-color)',
                'theme-accent': 'var(--accent-color)',
            },
        },
    },
    plugins: [],
}
