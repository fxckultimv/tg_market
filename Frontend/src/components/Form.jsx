import React, { useState } from 'react'
import { retrieveLaunchParams } from '@tma.js/sdk-react'
// import { text } from 'stream/consumers'

const now = () => {
    const date = new Date()
    const offset = date.getTimezoneOffset()
    const localISOTime = new Date(date.getTime() - offset * 60 * 1000)
        .toISOString()
        .slice(0, 16)
    return localISOTime
}

const Form = ({ addTodo }) => {
    const { initDataRaw } = retrieveLaunchParams()
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [completed_at, setCompleted_at] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (title.trim()) {
            addTodo(title, text, completed_at)
            setTitle('')
            setText('')
            setCompleted_at('')
        }
    }

    return (
        <div className="flex justify-center items-start bg-purple-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-purple-700 mb-6">
                    Add a new To-Do
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-purple-700 text-sm font-bold mb-2"
                            htmlFor="todo"
                        >
                            To-Do
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 mb-2  text-purple-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            id="todoTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your to-do"
                        />
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            id="todoText"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your to-do"
                        />
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-purple-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                            id="todoCompletedAt"
                            type="datetime-local"
                            value={completed_at}
                            onChange={(e) => setCompleted_at(e.target.value)}
                            placeholder="Enter time"
                            min={now()}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Add To-Do
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form
