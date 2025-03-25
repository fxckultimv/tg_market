import React from 'react'
import Delete from '../../assets/delete.svg'
import { useUserStore } from '../../store'
import { useToast } from '../../components/ToastProvider'
import { initDataRaw } from '@telegram-apps/sdk-react'

const DatePublication = ({ item }) => {
    const { fetchCart, deleteDateInCartItem, loading, error } = useUserStore()
    const { addToast } = useToast()

    // Преобразуем дату из строки в объект Date
    const publicationDate = new Date(item.post_time)
    // Получаем текущую дату + 3 часа
    const currentDate = new Date(Date.now() + 3 * 60 * 60 * 1000)
    // Сравниваем даты: если публикация уже прошла, то true
    const isPastDate = publicationDate < currentDate

    const deleteDateButton = async (publicationDate) => {
        try {
            await deleteDateInCartItem(
                initDataRaw(),
                publicationDate,
                item.cart_item_id
            )
            await fetchCart(initDataRaw())
            addToast('Дата удалена!')
        } catch (err) {
            console.log('Ошибка при создании заказа:', error)
        }
    }

    return (
        <li
            className={`text-black p-2 rounded-md flex justify-between gap-2 ${isPastDate ? 'bg-gray hover:scale-105 duration-300' : 'bg-white'}`}
            onClick={() => {
                if (isPastDate) {
                    deleteDateButton(publicationDate)
                }
            }}
        >
            <p className="">{publicationDate.toLocaleDateString()}</p>
            {isPastDate && <img src={Delete} alt="" />}
        </li>
    )
}

export default DatePublication
