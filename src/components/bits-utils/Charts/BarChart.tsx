import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar as Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    UserCountByPayrollTypeView,
    UserCountByPayrollTypeViewListStandardResponse,
} from 'src/services';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
);

export function BarChart({ chart }: { chart: any }) {
    const options = {
        elements: {
            bar: {
                borderWidth: 1,
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false as const,
            },
        },
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
                    padding: 8,
                    color: '#A6ACBE',
                    display: true,
                    font: {
                        size: 10,
                        family: "'Rubik', sans-serif",
                    },
                },
            },
            y: {
                grid: {
                    display: true,
                    color: '#EDEFF5',
                },
                border: {
                    dash: [8, 6],
                    display: false,
                },
                ticks: {
                    padding: 8,
                    color: '#A6ACBE',
                    font: {
                        size: 9,
                        family: "'Rubik', sans-serif",
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 3,
                },
                title: {
                    padding: {
                        left: 10,
                    },
                    font: {
                        family: "'Rubik', sans-serif",
                    },
                },
            },
            datalabels: {
                display: false,
                color: '#fff',
                font: {
                    size: 8,
                    family: 'Rubik',
                },
            },
            tooltip: {
                backgroundColor: '#ffd7bd',
                // titleColor: "#ffd7bd",
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
                cornerRadius: 4,
                displayColors: false,
                caretPadding: 0,
                bodyAlign: 'center' as const,
                titleMarginBottom: 0,
            },
        },
    };
    const labels = chart?.map((x: any) => x.month?.substring(0, 3));

    const data = {
        labels,
        datasets: [
            {
                label: 'Task created',
                data: chart?.map((x: any) => x.taskCompleted),
                backgroundColor: '#4FD1C5',
                barPercentage: 0.5,
            },
        ],
    };

    return <Chart options={options} data={data} />;
}
