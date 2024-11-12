import React from 'react'
import { Line } from 'react-chartjs-2'

const cpmData = [
    { date: '2024-01-01', cpm: 5.2 },
    { date: '2024-01-02', cpm: 5.5 },
    { date: '2024-01-03', cpm: 4.8 },
    { date: '2024-01-04', cpm: 4.5 },
    { date: '2024-01-05', cpm: 5.2 },
    { date: '2024-01-06', cpm: 4.8 },
    { date: '2024-01-07', cpm: 4.7 },
    { date: '2024-01-08', cpm: 5.3 },
    // и т.д.
]

const CPMChart = () => {
    const data = {
        labels: cpmData.map((data) => data.date),
        datasets: [
            {
                label: 'CPM (стоимость за 1000 просмотров)',
                data: cpmData.map((data) => data.cpm),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'CPM (стоимость за 1000 просмотров)',
            },
        },
    }

    return <Line data={data} options={options} />
}

export default CPMChart
