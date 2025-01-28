import React from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const OrdersInMounthChart = ({ orders }) => {
    // Преобразование данных
    const ordersPerDay = Array.isArray(orders)
        ? orders.reduce((acc, order) => {
              const day = new Date(order.created_at).getDate() // Получаем день месяца
              acc[day] = (acc[day] || 0) + 1 // Увеличиваем число заказов на этот день
              return acc
          }, {})
        : {}

    // Создаем массивы для оси X и Y
    const labels = Array.from({ length: 31 }, (_, i) => i + 1) // Дни месяца
    const dataValues = labels.map((day) => ordersPerDay[day] || 0) // Число заказов по дням

    // Данные для графика
    const data = {
        labels,
        datasets: [
            {
                label: 'Количество заказов',
                data: dataValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
            },
        ],
    }

    // Опции для графика
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Количество заказов за месяц' },
        },
        scales: {
            x: { title: { display: true, text: 'День месяца' } },
            y: {
                title: { display: true, text: 'Количество заказов' },
                beginAtZero: true,
            },
        },
    }

    return <Line data={data} options={options} className="min-w-[300px]" />
}

export default OrdersInMounthChart
