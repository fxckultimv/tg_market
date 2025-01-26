import React from 'react'
import { Bar } from 'react-chartjs-2'

const adPostsData = [
    { period: '2024-01-01', count: 5 },
    { period: '2024-01-02', count: 7 },
    { period: '2024-01-03', count: 4 },
    // и т.д.
]

const AdPostsChart = () => {
    const data = {
        labels: adPostsData.map((data) => data.period),
        datasets: [
            {
                label: 'Рекламные публикации',
                data: adPostsData.map((data) => data.count),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Количество рекламных публикаций' },
        },
    }

    return <Bar data={data} options={options} />
}

export default AdPostsChart
