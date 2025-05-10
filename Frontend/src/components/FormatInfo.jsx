import { useEffect, useRef, useState } from 'react'
import Info from '../assets/info.svg?react'

const FormatInfo = () => {
    const [visible, setVisible] = useState(false)
    const timerRef = useRef(null)
    const popupRef = useRef(null)

    useEffect(() => {
        if (visible) {
            timerRef.current = setTimeout(() => setVisible(false), 15000)
        }

        return () => clearTimeout(timerRef.current)
    }, [visible])

    return (
        <div className="relative inline-block">
            <div
                onClick={() => setVisible(true)}
                className="bg-blue w-6 h-6 flex items-center justify-center rounded-full text-white cursor-pointer"
            >
                <Info />
            </div>

            {visible && (
                <div
                    ref={popupRef}
                    className={`absolute z-50 top-8 right-0 w-72 p-4 translate-x-1/2 bg-background border rounded-lg shadow-lg transition-all transform ${
                        visible
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Форматы
                        </h3>
                        <button
                            onClick={() => setVisible(false)}
                            className="text-gray hover:text-red text-sm ml-2"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col text-sm text-gray-800 mt-2 space-y-1 whitespace-normal break-words">
                        <p>1/24 — 1 публикация в течение 24 часов</p>
                        <p>2/48 — 2 публикации в течение 48 часов</p>
                        <p>2/72 — 3 публикации в течение 72 часов</p>
                        <p>Indefinite — реклама навсегда в канале</p>
                        <p>Repost — репост поста из канала</p>
                        <p>
                            Response — дополнительный пост через 30 минут после
                            основного
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormatInfo
