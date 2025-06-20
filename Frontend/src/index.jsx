import ReactDOM from 'react-dom/client'
import {
    init,
    backButton,
    initData,
    viewport,
    swipeBehavior,
    mainButton,
} from '@telegram-apps/sdk-react'
import telegramAnalytics from '@telegram-apps/analytics'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ToastProvider } from './components/ToastProvider'
import { StrictMode } from 'react'
import { detectTelegramEnvironment } from './telegram'

let isTelegram = detectTelegramEnvironment()

if (isTelegram) {
    init()
    backButton.mount()
    initData.restore()
    viewport.mount()
    swipeBehavior.mount()
    mainButton.mount()
}

telegramAnalytics.init({
    token: 'eyJhcHBfbmFtZSI6IkNhcnJvdCIsImFwcF91cmwiOiJodHRwczovL3QubWUvY2Fycm90X2Fkc19ib3QiLCJhcHBfZG9tYWluIjoiaHR0cHM6Ly9jYXJyb3QtcHJvbW8ucnUvIn0=!MTCHkEaWwOqU1rFAB5UwQfclq2QREUrLMLgyMSwSrfs=',
    appName: 'Carrot',
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <TonConnectUIProvider
        manifestUrl="https://carrot-promo.ru/tonconnect-manifest.json"
        uiPreferences={{ theme: 'SYSTEM' }}
    >
        <StrictMode acceptCustomStyles debug>
            <BrowserRouter>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </BrowserRouter>
        </StrictMode>
    </TonConnectUIProvider>
)
