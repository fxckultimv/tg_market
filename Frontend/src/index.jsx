import ReactDOM from 'react-dom/client'
import { SDKProvider, useLaunchParams, useViewportRaw } from '@tma.js/sdk-react'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

ReactDOM.createRoot(document.getElementById('root')).render(
    <TonConnectUIProvider
        language="ru"
        manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
        uiPreferences={{ theme: 'SYSTEM' }}
    >
        <SDKProvider acceptCustomStyles debug>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SDKProvider>
    </TonConnectUIProvider>
)
