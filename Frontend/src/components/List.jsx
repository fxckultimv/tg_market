import React, { useState, useEffect } from 'react'
import { retrieveLaunchParams } from '@tma.js/sdk-react'
import Todo from './Todo'

const List = ({ todos, fetchTodos, changeTodoStatus, deleteTodo }) => {
    const { initDataRaw } = retrieveLaunchParams()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    console.log('a', todos)

    useEffect(() => {
        fetchTodos()
        setLoading(false)
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    const sortedTodos = [...todos].sort((a, b) => a.id - b.id)

    return (
        <div className="bg-white shadow-lg rounded-lg p-2 w-full max-w-md">
            <div className="pl-6">
                <h2 className="text-xl font-semibold text-purple-700 mb-6">
                    Todos
                </h2>
            </div>

            <ul className="list-disc list-inside">
                {sortedTodos.map((todos) => (
                    <Todo
                        key={todos.id}
                        id={todos.id}
                        title={todos.title}
                        text={todos.text_todo}
                        completed_at={todos.completed_at}
                        status={todos.status}
                        changeTodoStatus={changeTodoStatus}
                        deleteTodo={deleteTodo}
                    />
                ))}
            </ul>
        </div>
    )
}

export default List
