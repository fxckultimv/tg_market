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

// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const SalesChart = ({ ordersData }) => {
    // Преобразование данных ordersData для графика
    const data = {
        labels: ordersData.map((order) =>
            new Date(order.created_at).toLocaleDateString()
        ), // Даты заказов
        datasets: [
            {
                label: 'Сумма продаж',
                data: ordersData.map((order) => parseFloat(order.total_price)), // Суммы заказов
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4, // Кривизна линий
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'График продаж',
            },
        },
    }

    return <Line data={data} options={options} />
}

export default SalesChart
