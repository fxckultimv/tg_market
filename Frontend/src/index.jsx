import ReactDOM from 'react-dom/client'
import { SDKProvider, useLaunchParams } from '@tma.js/sdk-react'

import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <SDKProvider acceptCustomStyles debug>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </SDKProvider>
)
