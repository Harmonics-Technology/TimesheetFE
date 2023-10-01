import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut as Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function DoughnutChart({ chart }: { chart: any }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    usePointStyle: false,
                    boxWidth: 15,
                    boxHeight: 10,
                    font: {
                        size: 10,
                        fontFamily: 'Rubik',
                    },
                },
            },
            datalabels: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#ffd7bd',
                titleColor: '#ffd7bd',
                padding: { x: 20, y: 4 } as unknown as number,
                titleFont: {
                    size: 0,
                },
                bodyFont: {
                    size: 8,
                    fontFamily: 'Rubik',
                    weight: 'bold',
                },
                bodyColor: '#000',
                cornerRadius: 10,
                displayColors: false,
                caretPadding: 0,
                bodyAlign: 'center' as const,
                titleMarginBottom: 0,
            },
        },
        elements: {
            arc: {
                borderWidth: 0,
            },
        },
        cutout: '45%',
    };

    const labels = chart?.map((x) => x.name);

    const data = {
        labels,
        datasets: [
            {
                data: chart.map((x) => x.count),
                backgroundColor: ['#c2cfe0', '#45dab6', '#ffb27d'],
                hoverOffset: 4,
            },
        ],
    };

    return <Chart options={options} data={data} />;
}
