import { Link, useMatch } from 'react-router-dom'
import React from 'react'

const CustomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`p-2 rounded-lg w-12 h-12 ${match ? 'text-blue' : 'text-text'}`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default CustomLink
