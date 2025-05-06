import React from 'react'
import { Link } from 'react-router-dom'
import { useMatch } from 'react-router-dom'

const AdminCastomLink = ({ to, children, ...props }) => {
    const match = useMatch(to)

    return (
        <Link
            to={to}
            className={`flex gap-2 items-center ${
                match ? ' text-blue' : ' text-black'
            }`}
            {...props}
        >
            {children}
        </Link>
    )
}

export default AdminCastomLink
