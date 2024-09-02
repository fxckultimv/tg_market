import React from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import Form from './Form'
import List from './List'
import { retrieveLaunchParams } from '@tma.js/sdk-react'

interface Todo {
    id: number
    title: string
    text_todo: string
    status: number
    completed_at: string
}

const fetchTodos = async (initDataRaw: string) => {
    const response = await fetch('http://localhost:5000/todo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `tma ${initDataRaw}`,
        },
    })
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

const AppQuery: React.FC = () => {
    const { initDataRaw } = retrieveLaunchParams()
    const queryClient = useQueryClient()

    const { data: todos, isLoading } = useQuery({
        queryKey: ['todos', initDataRaw],
        queryFn: () => fetchTodos(initDataRaw),
    })

    const changeTodoStatusMutation = useMutation({
        mutationFn: (id: number) => {
            const todo = todos.find((todo: Todo) => todo.id === id)
            return fetch(`http://localhost:5000/todo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({
                    id: id,
                    status: todo.status === 1 ? 0 : 1,
                }),
            }).then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['todos', initDataRaw])
        },
    })

    const addTodoMutation = useMutation({
        mutationFn: (newTodo: {
            title: string
            text?: string
            completed_at?: string
        }) => {
            return fetch('http://localhost:5000/add_todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify(newTodo),
            }).then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['todos', initDataRaw])
        },
    })

    const deleteTodoMutation = useMutation({
        mutationFn: (id: number) => {
            return fetch('http://localhost:5000/todo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `tma ${initDataRaw}`,
                },
                body: JSON.stringify({ id }),
            }).then((response) => response.json())
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['todos', initDataRaw])
        },
    })

    const addTodo = (title: string, text?: string, completed_at?: string) => {
        addTodoMutation.mutate({ title, text, completed_at })
    }

    const changeTodoStatus = (id: number) => {
        changeTodoStatusMutation.mutate(id)
    }

    const deleteTodo = (id: number) => {
        deleteTodoMutation.mutate(id)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <Form addTodo={addTodo} />
            <List
                todos={todos}
                changeTodoStatus={changeTodoStatus}
                deleteTodo={deleteTodo}
            />
        </div>
    )
}

// Создание экземпляра QueryClient
const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AppQuery />
    </QueryClientProvider>
)

export default App
