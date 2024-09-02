import { Link, useMatch } from 'react-router-dom'
import React, { ReactNode } from 'react'

const CustomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`p-2 text-lg font-medium ${
                match
                    ? 'text-green-5border-green-500 border-b-2 border-green-500'
                    : 'text-gray-300 hover:text-gray-100'
            }`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default CustomLink
