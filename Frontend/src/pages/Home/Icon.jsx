import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const Icon = ({ icon, angle, delay, radius, index }) => {
    const rotate = useMotionValue(angle)
    const opacity = useTransform(
        rotate,
        [90, 110, 180, 250, 270],
        [1, 0, 0, 0, 1]
    )
    return (
        <motion.div
            className="absolute h-[100vw] top-0 overflow-hidden bottom-[-50vw]"
            style={{ rotate }}
            animate={{ rotate: 360 }}
            transition={{
                delay: delay,
                repeatDelay: 1,
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            <motion.div className="bg-white rounded-xl p-2" style={{ opacity }}>
                <img
                    src={icon}
                    alt="Cat"
                    className="h-[40px] pointer-events-none"
                />
            </motion.div>
        </motion.div>
    )
}

export default Icon
