import React, { useEffect, useState } from 'react'
import { initDataRaw } from '@telegram-apps/sdk-react'
import { useAdminStore } from '../../../store'
import { useToast } from '../../../components/ToastProvider'

const Promo = () => {
    const { promo, fetchPromo, addPromo, deletePromo, loading, error } =
        useAdminStore()
    const { addToast } = useToast()
    const [isAdding, setIsAdding] = useState(false)
    const [code, setCode] = useState('')
    const [validDays, setValidDays] = useState('')
    const [maxActivations, setMaxActivations] = useState('')
    const [percent, setPercent] = useState('')

    useEffect(() => {
        fetchPromo(initDataRaw())
    }, [])

    const handleAddPromo = async () => {
        if (percent > 5) {
            addToast('Больше 5%', 'error')
            return
        }
        try {
            await addPromo(
                initDataRaw(),
                code,
                validDays,
                maxActivations,
                percent
            )
            setCode('')
            setValidDays('')
            setMaxActivations('')
            setPercent('')
            setIsAdding(false)
            addToast('Промокод добавлен')
        } catch (err) {
            console.error(error)
            addToast('Ошибка при создании', 'error')
        }
    }

    const handleDeletePromo = async (promo_id) => {
        await deletePromo(initDataRaw(), promo_id)
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
            <h2 className="m-6 text-xl font-extrabold">
                Управление промокодами
            </h2>
            <ul className="w-full max-w-4xl bg-medium-gray rounded-lg p-2 shadow-md">
                {promo.map((promo) => (
                    <li
                        key={promo.id}
                        className="mb-4 p-2 rounded-lg bg-card-white"
                    >
                        <div
                            className="text-xl font-bold cursor-pointer"
                            title="Копировать"
                            onClick={() =>
                                navigator.clipboard.writeText(promo.code)
                            }
                        >
                            {promo.code}
                        </div>
                        <div className="text-gray text-sm">
                            <span className="">ID категории:</span> {promo.id}
                        </div>
                        <div className="">
                            Колличество: {promo.max_activations}
                        </div>
                        <div className="">Процент: {promo.percent}%</div>
                        <div className="">
                            Дейстие: {promo.valid_days}{' '}
                            {promo.valid_days <= 4 ? 'дня' : 'дней'}
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="p-2 bg-red rounded"
                                onClick={(e) => {
                                    e.stopPropagation() // предотвращаем срабатывание onClick на <li>
                                    handleDeletePromo(promo.id)
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
                {isAdding ? (
                    <li className="p-4 mb-4 rounded-lg bg-gray-700 shadow">
                        <div className="flex flex-col gap-2">
                            {' '}
                            <input
                                type="text"
                                className="w-full p-2 rounded-xl bg-medium-gray text-black"
                                placeholder="Promo"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <input
                                type="text"
                                className="w-full p-2 rounded-xl bg-medium-gray text-black"
                                placeholder="Колличество"
                                value={maxActivations}
                                onChange={(e) =>
                                    setMaxActivations(e.target.value)
                                }
                            />
                            <input
                                type="text"
                                className="w-full p-2 rounded-xl bg-medium-gray text-black"
                                placeholder="Процент < 5"
                                value={percent}
                                onChange={(e) => setPercent(e.target.value)}
                            />
                            <input
                                type="text"
                                className="w-full p-2 rounded-xl bg-medium-gray text-black"
                                placeholder="Дней"
                                value={validDays}
                                onChange={(e) => setValidDays(e.target.value)}
                            />
                        </div>

                        <button
                            className="w-full p-2 mt-2 bg-green rounded-xl"
                            onClick={handleAddPromo}
                        >
                            Добавить промокод
                        </button>
                        <button
                            className="w-full p-2 mt-2 bg-card-white rounded-xl"
                            onClick={() => setIsAdding(false)}
                        >
                            Отмена
                        </button>
                    </li>
                ) : (
                    <li
                        className="flex items-center justify-center p-4 rounded-lg bg-green cursor-pointer"
                        onClick={() => setIsAdding(true)}
                    >
                        <span className="text-2xl">+</span>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Promo
