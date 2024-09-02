import React, { useState } from 'react'
import { MainButton } from './MainButton'

const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleString('ru-Ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const Todo = ({
    id,
    title,
    text,
    status,
    completed_at,
    changeTodoStatus,
    deleteTodo,
}) => {
    const [showMainButton, setShowMainButton] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    console.log(completed_at)

    const handleDeleteClick = () => {
        setShowMainButton(true)
    }

    const handleMainButtonClick = () => {
        deleteTodo(id)
        setShowMainButton(false)
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="bg-purple-50 shadow-md rounded-lg p-4 mb-2">
            <div
                className="flex items-center justify-between"
                onClick={toggleExpand}
            >
                <span
                    className={`font-bold text-xl text-purple-700 ${
                        status === 1 ? 'line-through' : ''
                    }`}
                >
                    {title}
                </span>
                <button
                    className={`font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ${
                        status === 1
                            ? 'bg-green-500 hover:bg-green-700 text-white'
                            : 'bg-red-500 hover:bg-red-700 text-white'
                    }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        changeTodoStatus(id)
                    }}
                >
                    {status === 1 ? 'Completed' : 'To Do'}
                </button>
                <button
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick()
                    }}
                >
                    Delete
                </button>
            </div>
            <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-40' : 'max-h-0'
                }`}
            >
                <p className="mt-2 text-purple-700 break-words">{text}</p>
                <p className="mt-2 text-purple-700 break-words">
                    {formatDate(completed_at)}
                </p>
            </div>
            {showMainButton && <MainButton onClick={handleMainButtonClick} />}
        </div>
    )
}

export default Todo
