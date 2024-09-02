import React, { useEffect } from 'react'
import { useMainButton } from '@tma.js/sdk-react'

const MainButton = ({ onClick }) => {
    const mainButton = useMainButton()

    useEffect(() => {
        if (mainButton) {
            mainButton.setParams({
                backgroundColor: '#aa1388',
                text: 'Clicked!',
                isVisible: true,
            })

            mainButton.show()
            mainButton.enable()

            const handleClick = () => {
                console.log('Main Button was clicked')
                mainButton.setText('Clicked!')
                onClick()
            }

            mainButton.on('click', handleClick)

            return () => {
                mainButton.off('click', handleClick)
                mainButton.hide()
            }
        }
    }, [mainButton, onClick])

    return null
}

export { MainButton }
