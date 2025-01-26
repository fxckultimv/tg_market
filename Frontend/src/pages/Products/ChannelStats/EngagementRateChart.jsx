import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const engagementData = [
    { postId: 'Post 1', engagementRate: 12 },
    { postId: 'Post 2', engagementRate: 8 },
    { postId: 'Post 3', engagementRate: 15 },
    // и т.д.
]

const EngagementRateChart = () => {
    const data = {
        labels: engagementData.map((data) => data.postId),
        datasets: [
            {
                label: 'ER (%)',
                data: engagementData.map((data) => data.engagementRate),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Эффективность постов (ER)' },
        },
    }

    return <Bar data={data} options={options} />
}

export default EngagementRateChart
