import React, { useState } from 'react'
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

const data = {
    dates: [
        '28 сент',
        '29 сент',
        '30 сент',
        '1 окт',
        '2 окт',
        '3 окт',
        '4 окт',
        '5 окт',
        '6 окт',
        '7 окт',
        '8 окт',
        '9 окт',
        '10 окт',
        '11 окт',
        '12 окт',
        '13 окт',
        '14 окт',
        '15 окт',
        '16 окт',
        '17 окт',
    ],
    subscribed: [
        120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 245, 250,
        253, 256, 265, 260, 270, 290, 300,
    ],
    unsubscribed: [
        80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 100, 90, 96,
        104, 300, 100, 86, 76, 84, 55,
    ],
}

const SubscribersChart = () => {
    const [range, setRange] = useState([0, 100]) // Диапазон отображаемых данных

    // Функция для обработки изменения диапазона
    const handleRangeChange = (e) => {
        const [start, end] = e.target.value.split(',').map(Number)
        setRange([start, end])
    }

    // Фильтрация данных в зависимости от диапазона
    const filteredDates = data.dates.slice(range[0], range[1])
    const filteredSubscribed = data.subscribed.slice(range[0], range[1])
    const filteredUnsubscribed = data.unsubscribed.slice(range[0], range[1])

    const chartData = {
        labels: filteredDates,
        datasets: [
            {
                label: 'Подписались',
                data: filteredSubscribed,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Отписались',
                data: filteredUnsubscribed,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Подписчики' },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Дата',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество',
                },
            },
        },
    }

    return (
        <div>
            <Line data={chartData} options={options} />

            <div style={{ marginTop: '20px' }}>
                <label>Диапазон видимости: </label>
                <input
                    type="range"
                    min="0"
                    max={data.dates.length - 1}
                    value={range.join(',')}
                    onChange={handleRangeChange}
                    style={{ width: '100%' }}
                />
                <p>
                    От {data.dates[range[0]]} до {data.dates[range[1] - 1]}
                </p>
            </div>
        </div>
    )
}

export default SubscribersChart
