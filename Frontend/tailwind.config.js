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
                'main-green': '#4ade80',
                'accent-green': '#22c55e',
            },
        },
    },
    plugins: [],
}
