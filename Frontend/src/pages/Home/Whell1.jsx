import React from 'react'
import Cat from '../../assets/cat-home.svg'
import Money from '../../assets/money-dollar.svg'
import BankHome from '../../assets/bank-home.svg'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import lucky from '../../assets/lucky.svg'
import bigLogo from '../../assets/bigLogo.svg'
import Ellipse from '../../assets/Ellipse.svg'
import Clover from '../../assets/clover.svg'

const Whell1 = () => {
    const icons = [Cat, Clover, Money, BankHome]

    return (
        <div className="flex flex-col items-center text-center py-10">
            <div className="relative w-full h-[300px] flex justify-center items-center">
                {/* Фон или неподвижный элемент */}
                <img
                    src={Ellipse}
                    alt="Background"
                    className="absolute top-0 z-0"
                />

                {/* Центральный логотип */}
                <img
                    src={bigLogo}
                    alt="Main logo"
                    className="relative w-[147px] h-[147px] drop-shadow-[0_0_25px_blue] z-10"
                />

                {/* Анимированные иконки */}
                {icons.map((icon, index) => {
                    const rotate = useMotionValue(0) // Отдельный `rotate` для каждого элемента
                    const opacity = useTransform(
                        rotate,
                        [90, 110, 180, 250, 270],
                        [1, 0, 0, 0, 1]
                    )

                    return (
                        <motion.div
                            key={index}
                            className="absolute h-[100vw] top-0 overflow-hidden bottom-[-50vw]"
                            animate={{ rotate: 360 }}
                            transition={{
                                delay: index * 1, // Разная задержка
                                duration: 5,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            style={{ rotate }} // Применяем rotate
                        >
                            <motion.div
                                className="bg-white rounded-xl p-2"
                                style={{ opacity }} // Применяем opacity
                            >
                                <img
                                    src={icon}
                                    alt="Icon"
                                    className="h-[40px] pointer-events-none"
                                />
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>
            <h1 className="text-4xl font-bold mt-8 z-10">
                Carrot — это продвижение в{' '}
                <span className="text-blue">Telegram</span>
            </h1>

            <p className="text-gray-600 mt-4 max-md:text-xs">
                Наше приложение помогает покупать рекламу в Telegram-каналах и
                автоматизировать процесс её продажи.
            </p>
        </div>
    )
}

export default Whell1
