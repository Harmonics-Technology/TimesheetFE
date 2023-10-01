import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line as Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function BurnOutChart({ chart }: { chart: any }) {
    const options = {
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    display: true,
                    font: {
                        size: 8,
                        fontFamily: 'Rubik',
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 8,
                        fontFamily: 'Rubik',
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'right' as const,
            },
            datalabels: {
                display: false,
            },

            tooltip: {
                backgroundColor: '#2eafa3',
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
                bodyColor: '#fff',
                cornerRadius: 2,
                displayColors: false,
                caretPadding: 0,
                bodyAlign: 'center' as const,
                titleMarginBottom: 0,
            },
        },
    };

    const linearGradient = (context, bg) => {
        const bgColor = bg;
        if (!context.chart.chartArea) {
            return;
        }
        const {
            ctx,
            data,
            chartArea: { top, bottom },
        } = context.chart;
        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
        const colorTranches = 1 / (bgColor.length - 1);
        for (let i = 0; i < bgColor.length - 1; i++) {
            gradientBg.addColorStop(0 + i * colorTranches, bgColor[i]);
        }
        return gradientBg;
    };

    const labels = chart?.map((x) => x.month.substring(0, 3));

    const data = {
        labels,
        datasets: [
            {
                label: 'Project',
                data: chart?.map((x) => x.rate),
                fill: true,
                borderColor: '#E46A11',
                tension: 0.4,
                pointRadius: 0,
                backgroundColor: (context) =>
                    linearGradient(context, [
                        'rgba(233, 136, 65, 0.30)',
                        'rgba(233, 136, 65, 0.10)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                    ]),
            },
        ],
    };

    return <Chart options={options} data={data} />;
}
