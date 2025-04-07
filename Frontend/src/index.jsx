import ReactDOM from 'react-dom/client'
import {
    init,
    backButton,
    initData,
    viewport,
    swipeBehavior,
    mainButton,
} from '@telegram-apps/sdk-react'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ToastProvider } from './components/ToastProvider'
import { StrictMode } from 'react'

init()
backButton.mount()
initData.restore()
viewport.mount()
swipeBehavior.mount()
mainButton.mount()

ReactDOM.createRoot(document.getElementById('root')).render(
    <TonConnectUIProvider
        manifestUrl="https://marusinohome.ru/tonconnect-manifest.json"
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
