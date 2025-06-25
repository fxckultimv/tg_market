import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCart from './locales/en/Cart.json'
import ruCart from './locales/ru/Cart.json'
import enSetting from './locales/en/Setting.json'
import ruSetting from './locales/ru/Setting.json'
import enCreateAd from './locales/en/CreateAd.json'
import ruCreateAd from './locales/ru/CreateAd.json'
import enChannels from './locales/en/Channels.json'
import ruChannels from './locales/ru/Channels.json'
import enHome from './locales/en/Home.json'
import ruHome from './locales/ru/Home.json'
import enProfile from './locales/en/Profile.json'
import ruProfile from './locales/ru/Profile.json'
import enTon from './locales/en/Ton.json'
import ruTon from './locales/ru/Ton.json'
import enPromo from './locales/en/Promo.json'
import ruPromo from './locales/ru/Promo.json'
import enHistory from './locales/en/History.json'
import ruHistory from './locales/ru/History.json'
import enCommon from './locales/en/common.json'
import ruCommon from './locales/ru/common.json'
// 🔁 и т.д. для других страниц

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
        'common',
        'Cart',
        'Setting',
        'Home',
        'CreateAd',
        'Channels',
        'Profile',
        'Ton',
        'Promo',
        'History',
    ],
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            common: enCommon,
            Cart: enCart,
            Setting: enSetting,
            CreateAd: enCreateAd,
            Channels: enChannels,
            Home: enHome,
            Profile: enProfile,
            Ton: enTon,
            Promo: enPromo,
            History: enHistory,
            // ...
        },
        ru: {
            common: ruCommon,
            Cart: ruCart,
            Setting: ruSetting,
            CreateAd: ruCreateAd,
            Channels: ruChannels,
            Home: ruHome,
            Profile: ruProfile,
            Ton: ruTon,
            Promo: ruPromo,
            History: ruHistory,
            // ...
        },
    },
})

export default i18n
