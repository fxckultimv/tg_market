import { Link, useMatch } from 'react-router-dom'
import React from 'react'

const ProfileCustomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`p-3 rounded-lg w-full text-text  border-[1px] border-gray max-sm:p-2 ${
                match ? ' bg-blue' : ' bg-card-white hover:text-gray'
            }`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default ProfileCustomLink
