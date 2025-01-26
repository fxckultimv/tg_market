import React from 'react'
import { Link } from 'react-router-dom'

const UserList = ({
    users,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
}) => {
    return (
        <>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {Array.isArray(users) &&
                    users.map((user) => (
                        <Link key={user.user_id} to={`${user.user_id}`}>
                            <li
                                key={user.user_id}
                                className="mb-1 p-2 rounded-lg bg-dark-gray  shadow transition duration-300 hover:shadow-lg"
                            >
                                <div className="text-xl font-bold">
                                    {user.username}
                                </div>
                                <div className="">
                                    <span className="">ID:</span> {user.user_id}
                                </div>
                                <div className="">
                                    <span className="">Рейтинг:</span>{' '}
                                    {user.rating}
                                </div>
                                <div className="">
                                    <span className="">Дата создания:</span>{' '}
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </div>
                            </li>
                        </Link>
                    ))}
            </ul>
            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="mx-1 px-3 py-1 rounded bg-gray-700  disabled:opacity-50"
                >
                    &laquo; Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`mx-1 px-3 py-1 rounded ${
                            currentPage === i + 1
                                ? 'bg-main-green '
                                : 'bg-gray-700 '
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="mx-1 px-3 py-1 rounded bg-gray-700  disabled:opacity-50"
                >
                    Next &raquo;
                </button>
            </div>
        </>
    )
}

export default UserList
