import React from 'react'
import Cat from '../../assets/cat-home.svg'
import Money from '../../assets/money-dollar.svg'
import BankHome from '../../assets/bank-home.svg'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import lucky from '../../assets/lucky.svg'
import bigLogo from '../../assets/bigLogo.svg'
import Ellipse from '../../assets/Ellipse.svg'
import Clover from '../../assets/clover.svg'
import tg from '../../assets/tg.svg'

const Whell2 = () => {
    const icons = [Cat, Clover, Money, BankHome]

    return (
        <div className="flex flex-col items-center text-center py-10">
            <div className="relative w-full h-[300px] flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold mt-8 z-10">
                        Связаться с нами
                    </h1>
                    <p className="mt-4 max-w-2xl text-center">
                        У вас есть вопросы или вы хотите обсудить детали
                        продвижения? Мы готовы помочь!
                    </p>

                    {/* Кнопка */}
                    <div className="mt-6">
                        <button className="bg-blue text-white py-3 px-6 rounded-xl flex items-center gap-2">
                            <img src={tg} alt="Telegram" className="w-5 h-5" />
                            <span>Перейти в телеграм</span>
                        </button>
                    </div>
                </div>

                {/* Анимированные иконки */}
                {icons.map((icon, index) => {
                    const rotate = useMotionValue(180) // Отдельный `rotate` для каждого элемента
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
                                delay: index * 1,
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
                TeleAdMarket — это продвижение в{' '}
                <span className="text-blue">Telegram</span>
            </h1>

            <p className="text-gray-600 mt-4 max-md:text-xs">
                Наше приложение помогает покупать рекламу в Telegram-каналах и
                автоматизировать процесс её продажи.
            </p>
        </div>
    )
}

export default Whell2
