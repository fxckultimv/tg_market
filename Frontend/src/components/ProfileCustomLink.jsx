import { Link, useMatch } from 'react-router-dom'
import React from 'react'

const ProfileCustomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)
    console.log(match)

    return (
        <Link
            to={to}
            className={`p-3 rounded-lg w-full ${
                match
                    ? ' bg-blue text-white'
                    : 'text-black bg-card-white hover:text-gray'
            }`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default ProfileCustomLink
