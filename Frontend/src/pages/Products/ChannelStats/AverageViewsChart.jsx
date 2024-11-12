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

const viewsData = [
    { date: '2024-01-01', averageViews: 150 },
    { date: '2024-01-02', averageViews: 180 },
    { date: '2024-01-03', averageViews: 120 },
    { date: '2024-01-04', averageViews: 150 },
    { date: '2024-01-05', averageViews: 180 },
    { date: '2024-01-06', averageViews: 200 },
    { date: '2024-01-07', averageViews: 110 },
    { date: '2024-01-08', averageViews: 170 },
    // и т.д.
]

const AverageViewsChart = () => {
    const data = {
        labels: viewsData.map((data) => data.date),
        datasets: [
            {
                label: 'Среднее количество просмотров',
                data: viewsData.map((data) => data.averageViews),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
                text: 'Среднее количество просмотров постов',
            },
        },
    }

    return <Line data={data} options={options} />
}

export default AverageViewsChart
