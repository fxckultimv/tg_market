/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        extend: {
            colors: {
                background: 'rgba(var(--background))',
                white: '#FFFFFF',
                'card-white': 'rgba(var(--card-white))',
                'main-gray': '#F6F6F6',
                gray: '#CDCDCD',
                green: '#25C65F',
                red: '#F84F52',
                blue: '#007AFF',
                'phone-blue': '#2DB9FF',
                'dark-blue': '#12172D',
                'main-blue': '#1E2336',
                'light-gray': 'rgba(var(--light-gray))',
                dark: '#191A23',
                black: '#000000',
                text: 'rgba(var(--text))',
                yellow: '#fde047',
                'info-box': 'rgba(var(--info-box))',
                // Используем CSS-переменные
                'theme-bg': 'var(--bg-color)',
                'theme-button': 'var(--button-color)',
                'theme-button-text': 'var(--button-text-color)',
                'theme-accent': 'var(--accent-color)',
            },
            screens: {
                sm: '480px',
                md: '768px',
                lg: '976px',
                xl: '1440px',
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                cardGradient:
                    'radial-gradient(160.07% 169.33% at 21.44% 2.5%, #FFF 0%, #F6F6F6 100%)',
            },
            boxShadow: {
                card: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            },
        },
    },
    plugins: [],
}
