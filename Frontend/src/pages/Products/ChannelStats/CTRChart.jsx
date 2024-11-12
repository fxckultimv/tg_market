import React from 'react'
import { Bar } from 'react-chartjs-2'

const ctrData = [
    { postId: 'Ad 1', ctr: 2.5 },
    { postId: 'Ad 2', ctr: 3.1 },
    { postId: 'Ad 3', ctr: 1.8 },
    { postId: 'Ad 4', ctr: 1.7 },
    { postId: 'Ad 5', ctr: 1.9 },
    { postId: 'Ad 6', ctr: 2 },
    { postId: 'Ad 7', ctr: 2.1 },
    { postId: 'Ad 8', ctr: 1.8 },
    { postId: 'Ad 9', ctr: 1.6 },
    // и т.д.
]

const CTRChart = () => {
    const data = {
        labels: ctrData.map((data) => data.postId),
        datasets: [
            {
                label: 'CTR (%)',
                data: ctrData.map((data) => data.ctr),
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'CTR (Click-through rate)' },
        },
    }

    return <Bar data={data} options={options} />
}

export default CTRChart
