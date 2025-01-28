import React from 'react'
import { useState } from 'react'

const AdminTransactions = () => {
    const [menu, setMenu] = useState(false)

    const toggleMenu = () => {
        setMenu(!menu)
    }
    return (
        <div className="flex overflow-y-scroll">
            <div onClick={toggleMenu}>
                <ul
                    className={`bg-gray ${menu ? 'w-[200px]' : 'w-[50px]'} h-full fixed`}
                >
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                </ul>
            </div>
            <div
                className="ml-[200px] overflow-y-auto h-full bg-gray-100 w-full p-4"
                style={{ marginLeft: menu ? '200px' : '50px' }}
            >
                <ul>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                    <li>GHaf</li>
                </ul>
            </div>
        </div>
    )
}

export default AdminTransactions
