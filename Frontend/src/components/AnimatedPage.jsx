import { motion } from 'framer-motion'

const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
}

const pageTransition = {
    duration: 0.5,
    ease: 'easeInOut', // Более плавный эффект появления и исчезновения
}

export default function AnimatedPage({ children }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    )
}
