import { useEffect } from 'react'

const usePreventCollapse = () => {
    useEffect(() => {
        const ensureDocumentIsScrollable = () => {
            const isScrollable =
                document.documentElement.scrollHeight > window.innerHeight
            if (!isScrollable) {
                document.documentElement.style.setProperty(
                    'height',
                    'calc(100vh + 1px)',
                    'important'
                )
            }
        }

        const preventCollapse = () => {
            if (window.scrollY === 0) {
                window.scrollTo(0, 1)
            }
        }

        window.addEventListener('load', ensureDocumentIsScrollable)
        window.addEventListener('touchstart', preventCollapse)

        return () => {
            window.removeEventListener('load', ensureDocumentIsScrollable)
            window.removeEventListener('touchstart', preventCollapse)
        }
    }, [])
}

export default usePreventCollapse
