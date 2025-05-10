import React from 'react'
import { useUserStore } from '../store'

const currencySymbols = {
    usd: '$',
    eur: '€',
    rub: '₽',
    uah: '₴',
    cny: '¥',
}

const EquivalentCourse = ({ ton }) => {
    const { course, courses, convertTon, isCoursesReady } = useUserStore()

    if (!isCoursesReady()) return null

    const price = convertTon(ton)
    const symbol = currencySymbols[course] || course.toUpperCase()
    return (
        <p>
            ≈ {price} {symbol}
        </p>
    )
}

export default EquivalentCourse
