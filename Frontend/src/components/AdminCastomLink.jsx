import React from 'react'
import { Link } from 'react-router-dom'
import { useMatch } from 'react-router-dom'

const AdminCastomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`flex gap-2 items-center ${
                match ? ' border-r-2 border-blue' : ' hover:text-white'
            }`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default AdminCastomLink
