import React from 'react'
import { Line } from 'react-chartjs-2'

const frequencyData = [
    { date: '2024-01-01', postCount: 3 },
    { date: '2024-01-02', postCount: 5 },
    { date: '2024-01-03', postCount: 2 },
    // и т.д.
]

const PostingFrequencyChart = () => {
    const data = {
        labels: frequencyData.map((data) => data.date),
        datasets: [
            {
                label: 'Частота публикаций',
                data: frequencyData.map((data) => data.postCount),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Частота публикаций' },
        },
    }

    return <Line data={data} options={options} />
}

export default PostingFrequencyChart
