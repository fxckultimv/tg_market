import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

// Зарегистрируйте необходимые элементы, включая ArcElement
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
)

const conversionData = [
    { campaign: 'Campaign 1', conversionRate: 4.2 },
    { campaign: 'Campaign 2', conversionRate: 3.8 },
    { campaign: 'Campaign 3', conversionRate: 5.1 },
    // и т.д.
]

const ConversionChart = () => {
    const data = {
        labels: conversionData.map((data) => data.campaign),
        datasets: [
            {
                label: 'Конверсия (%)',
                data: conversionData.map((data) => data.conversionRate),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Конверсия' },
        },
    }

    return <Pie data={data} options={options} />
}

export default ConversionChart
