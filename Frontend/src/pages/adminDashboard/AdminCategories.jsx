import React, { useEffect, useState } from 'react'
import { useAdminStore } from '../../store'
import { useLaunchParams } from '@tma.js/sdk-react'

const AdminCategories = () => {
    const {
        categories,
        fetchCategories,
        addCategory,
        deleteCategory,
        patchCategory,
        loading,
        error,
    } = useAdminStore()
    const { initDataRaw } = useLaunchParams()
    const [isAdding, setIsAdding] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [categoryToEdit, setCategoryToEdit] = useState(null) // состояние для редактируемой категории
    const [editedCategoryName, setEditedCategoryName] = useState('')

    useEffect(() => {
        fetchCategories(initDataRaw)
    }, [fetchCategories, initDataRaw])

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(initDataRaw, newCategoryName)
            setNewCategoryName('')
            setIsAdding(false)
        }
    }

    const handleDeleteCategory = (categoryId) => {
        deleteCategory(initDataRaw, categoryId)
        setCategoryToDelete(null) // сбрасываем состояние после удаления
    }

    const handleEditCategory = (categoryId, newName) => {
        patchCategory(initDataRaw, categoryId, newName)
        setCategoryToEdit(null) // сбрасываем состояние после редактирования
        fetchCategories(initDataRaw) // обновляем список категорий после изменения
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl font-semibold">Загрузка...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-gray bg">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-dark-gray">
            <h2 className="mb-6 text-xl font-extrabold">
                Управление категориями
            </h2>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {categories.map((category) => (
                    <li
                        key={category.category_id}
                        className="mb-4 p-4 rounded-lg bg-dark-gray shadow transition duration-300 hover:shadow-lg"
                    >
                        {categoryToEdit === category.category_id ? (
                            <>
                                <input
                                    type="text"
                                    className="w-full p-2 mb-2 rounded bg-medium-gray"
                                    value={editedCategoryName}
                                    onChange={(e) =>
                                        setEditedCategoryName(e.target.value)
                                    }
                                    placeholder="Новое название категории"
                                />
                                <button
                                    className="w-full p-2 mt-2 bg-white bg-accent-green rounded hover:bg-green-600"
                                    onClick={() =>
                                        handleEditCategory(
                                            category.category_id,
                                            editedCategoryName
                                        )
                                    }
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="w-full p-2 mt-2 bg-red-500 rounded hover:bg-red-600"
                                    onClick={() => setCategoryToEdit(null)}
                                >
                                    Отмена
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-bold">
                                    {category.category_name}
                                </div>
                                <div className="">
                                    <span className="">ID категории:</span>{' '}
                                    {category.category_id}
                                </div>
                                <button
                                    className="mt-4 p-2 bg-red-500 rounded hover:bg-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation() // предотвращаем срабатывание onClick на <li>
                                        handleDeleteCategory(
                                            category.category_id
                                        )
                                    }}
                                >
                                    Удалить
                                </button>
                                <button
                                    className="mt-4 p-2 bg-blue-500 rounded hover:bg-blue-600"
                                    onClick={(e) => {
                                        e.stopPropagation() // предотвращаем срабатывание onClick на <li>
                                        setCategoryToEdit(category.category_id)
                                        setEditedCategoryName(
                                            category.category_name
                                        )
                                    }}
                                >
                                    Изменить название
                                </button>
                            </>
                        )}
                    </li>
                ))}
                {isAdding ? (
                    <li className="p-4 mb-4 rounded-lg bg-gray-700 shadow">
                        <input
                            type="text"
                            className="w-full p-2 mb-2 rounded bg-medium-gray"
                            placeholder="Название категории"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <button
                            className="w-full p-2 mt-2 bg-accent-green rounded hover:bg-green-600"
                            onClick={handleAddCategory}
                        >
                            Добавить категорию
                        </button>
                        <button
                            className="w-full p-2 mt-2 bg-red-500 rounded hover:bg-red-600"
                            onClick={() => setIsAdding(false)}
                        >
                            Отмена
                        </button>
                    </li>
                ) : (
                    <li
                        className="flex items-center justify-center p-4 rounded-lg bg-gray-700 shadow transition duration-300 hover:shadow-lg cursor-pointer"
                        onClick={() => setIsAdding(true)}
                    >
                        <span className="text-2xl">+</span>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default AdminCategories
