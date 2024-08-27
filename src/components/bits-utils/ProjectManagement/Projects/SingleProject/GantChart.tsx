import React, { useEffect, useMemo, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { TopBar } from './TopBar';
import {
    Box,
    Button,
    HStack,
    Image,
    Select,
    Table,
    Td,
    Text,
    Th,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { AddNewTaskDrawer } from '../../Modals/AddNewTaskDrawer';
import { ProjectTaskViewPagedCollection, ProjectView } from 'src/services';
import moment from 'moment';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import highchartsGantt from 'highcharts/modules/gantt';
import dynamic from 'next/dynamic';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts);
    highchartsGantt(Highcharts);
}

export const GantChart = ({
    id,
    project,
    tasks,
    users,
    currencies,
}: {
    id: any;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    users: any;
    currencies: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<any>();
    const [viewMode, setViewMode] = useState(ViewMode.Day);
    const [view, setView] = useState('daily');
    const [len, setLen] = useState(0);

    const ReactHighChart = dynamic(() => import('highcharts-react-official'), {
        ssr: false,
    });

    const newTasks = tasks?.value?.map((x) => ({
        start: new Date(x?.startDate as string),
        end: new Date(x?.endDate as string),
        name: x.name,
        id: x.id,
        type: 'task',
        progress: x?.percentageOfCompletion,
        isDisabled: true,
        startFormatted: moment(x?.startDate).format('DD/MM/YY'), // Formatted start date
        endFormatted: moment(x?.endDate).format('DD/MM/YY'),
        // dependencies: [x.id],
        project: 'Yomy',
        styles: {
            progressColor: '#ffbb54',
            progressSelectedColor: '#ff9e0d',
        },
    }));

    // const [chartOptions, setChartOptions] = useState({
    //     chart: {
    //         type: 'gantt',
    //     },
    //     title: {
    //         text: 'Project Gantt Chart',
    //     },
    //     xAxis: {
    //         type: 'datetime',
    //     },
    //     yAxis: {
    //         type: 'category',
    //     },
    //     series: [
    //         {
    //             newTasks,
    //         },
    //     ],
    // });

    const day = 24 * 36e5,
        today = Math.floor(Date.now() / day) * day;

    const parseDate = (dateString) => {
        const dateParts = (dateString as any).split('-');
        return Date.UTC(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
        );
    };

    // Function to calculate min and max based on series data
    const calculateMinMaxDates = () => {
        if (!tasks?.value || tasks.value.length === 0)
            return { minDate: null, maxDate: null };

        const dates = tasks.value.flatMap((task) => [
            parseDate(task.startDate),
            parseDate(task.endDate),
        ]);

        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);

        return { minDate, maxDate };
    };

    const getRandomColor = () => {
        if (typeof Highcharts === 'object') {
            const colors = Highcharts?.getOptions().colors || '';
            return colors[Math.floor(Math.random() * colors.length)];
        }
    };

    const chartData = useMemo(() => {
        return tasks?.value?.map((x) => {
            return {
                start: parseDate(x?.startDate),
                end: parseDate(x?.endDate),
                completed: {
                    amount: (x?.percentageOfCompletion as number) / 100,
                    fill: getRandomColor(),
                },
                name: x?.name,
                color: '#E2E8F0', // Set the color here
                // color: {
                //     linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                //     stops: [
                //         [0, '#1A5276'], // Darker shade for remaining
                //         [1, '#3498DB'], // Lighter shade for completed
                //     ],
                // },
            };
        });
    }, []);

    const getXAxisOptions = () => {
        const { minDate, maxDate } = calculateMinMaxDates();
        switch (view) {
            case 'daily':
                return {
                    dateTimeLabelFormats: {
                        day: '<span style="opacity: 0.5; font-size: 0.7em">%a</span><br>%e<br><span style="opacity: 0.5; font-size: 0.7em">%b</span>',
                    },
                    gridLineWidth: 1,
                    min: minDate ? minDate + (len + 0) * day : undefined,
                    max: minDate ? minDate + (len + 20) * day : undefined,
                    labels: {
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                    title: {
                        text: 'Days',
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                };
            case 'weekly':
                return {
                    type: 'datetime',
                    tickInterval: 7 * 24 * 3600 * 1000, // One week
                    labels: {
                        format: 'W{value:%W}', // e.g., W24, W25
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                    title: {
                        text: 'Weeks',
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                };
            case 'monthly':
                return {
                    type: 'datetime',
                    tickInterval: 30 * 24 * 3600 * 1000, // One month (approx)
                    labels: {
                        format: '{value:%b %Y}', // e.g., Jan 2024
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                    title: {
                        text: 'Months',
                        style: {
                            fontFamily: 'Rubik, sans-serif', // Change font family
                        },
                    },
                };
            default:
                return {};
        }
    };

    const options = {
        title: {
            text: '',
        },
        chart: {
            zoomType: 'x', // Enable zooming on x-axis
        },
        xAxis: getXAxisOptions(),
        yAxis: {
            uniqueNames: true,
            labels: {
                style: {
                    fontFamily: 'Rubik, sans-serif', // Change font family
                    fontWeight: 'normal',
                    fontSize: '13px',
                },
            },
            title: {
                text: 'Task Name',
                style: {
                    fontFamily: 'Rubik, sans-serif',
                },
            },
        },
        plotOptions: {
            series: {
                groupPadding: 0,
                dataLabels: [
                    {
                        enabled: true,
                        align: 'left',
                        format: '{point.name}',
                        padding: 10,
                        style: {
                            fontWeight: 'normal',
                            textOutline: 'none',
                            fontFamily: 'Rubik, sans-serif',
                        },
                    },
                    {
                        enabled: true,
                        align: 'right',
                        format:
                            '{#if point.completed}{(multiply ' +
                            'point.completed.amount 100):.0f}%{/if}',
                        padding: 10,
                        style: {
                            fontWeight: 'normal',
                            textOutline: 'none',
                            fontFamily: 'Rubik, sans-serif',
                            opacity: 0.6,
                        },
                    },
                ],
            },
        },
        accessibility: {
            point: {
                descriptionFormat:
                    '{yCategory}. ' +
                    '{#if completed}Task {(multiply completed.amount 100):.1f}% ' +
                    'completed. {/if}' +
                    'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.',
            },
        },
        lang: {
            accessibility: {
                axis: {
                    xAxisDescriptionPlural:
                        'The chart has a two-part X axis ' +
                        'showing time in both week numbers and days.',
                },
            },
        },
        tooltip: {
            style: {
                fontFamily: 'Rubik, sans-serif', // Change font family
            },
            pointFormat:
                '<span style="font-weight: bold">{point.name}</span><br>' +
                '{point.start:%e %b}' +
                '{#unless point.milestone} → {point.end:%e %b}{/unless}' +
                '<br>' +
                '{#if point.completed}' +
                'Completed: {multiply point.completed.amount 100}%<br>' +
                '{/if}',
            // 'Owner: {#if point.owner}{point.owner}{else}unassigned{/if}',
        },
        series: [
            {
                name: '',
                color: 'red',
                data: chartData,
            },
        ],
    };

    const renderTaskList = (task) => (
        <Tr fontSize="12px">
            <Td
                noOfLines={1}
                pr="0"
                minW={0}
                w="200px"
                pl=".5rem"
                borderRight="1px solid"
                borderColor="gray.200"
            >
                {task.name}
            </Td>
            <Td
                px="0"
                minW={0}
                w="70px"
                borderRight="1px solid"
                borderColor="gray.200"
                pl=".4rem"
            >
                {task.startFormatted}
            </Td>
            <Td px="0" minW={0} w="70px" pl=".4rem">
                {task.endFormatted}
            </Td>
        </Tr>
    );

    return (
        <Box>
            <TopBar
                currencies={currencies}
                id={id}
                data={project}
                users={users}
                // noTitle
            />
            <HStack py="1rem" justify="space-between" display="none" mt="1rem" >
                <HStack w="17%">
                    <HStack w="full">
                        <Image
                            src="/assets/filter.png"
                            alt="filter"
                            w="1.1rem"
                            h="1.1rem"
                        />
                        <Text fontSize=".8rem" color="#2d3748" fontWeight={500}>
                            Filter By
                        </Text>
                    </HStack>
                    <Select fontSize=".8rem" w="full">
                        <option value="option1">Status</option>
                    </Select>
                </HStack>

                <HStack>
                    <Button
                        onClick={onOpen}
                        bgColor="brand.400"
                        color="white"
                        h="2rem"
                        borderRadius=".3rem"
                        fontSize=".8rem"
                    >
                        Add new task
                    </Button>
                    <SubSearchComponent />
                </HStack>
            </HStack>
            <Box w="full" bgColor="white" p="1rem" borderRadius="16px">
                <HStack style={{ marginBottom: '20px' }} justify="flex-end">
                    <Button
                        onClick={() => {
                            setView('daily');
                        }}
                        bgColor={view === 'daily' ? 'brand.400' : 'gray.200'}
                        color={view === 'daily' ? 'white' : 'black'}
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Day View
                    </Button>
                    <Button
                        onClick={() => {
                            setView('weekly');
                        }}
                        bgColor={view === 'weekly' ? 'brand.400' : 'gray.200'}
                        color={view === 'weekly' ? 'white' : 'black'}
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Week View
                    </Button>
                    <Button
                        onClick={() => {
                            setView('monthly');
                        }}
                        bgColor={view === 'monthly' ? 'brand.400' : 'gray.200'}
                        color={view === 'monthly' ? 'white' : 'black'}
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Month View
                    </Button>
                </HStack>
                {(newTasks?.length as any) > 0 ? (
                    <HStack w="full" overflow={'auto'} align="flex-start">
                        <Box overflow="auto" w="100%" minH="50vh">
                            {/* <Gantt
                                tasks={
                                    newTasks?.sort(
                                        (a, b) =>
                                            (a?.start as any) -
                                            (b?.start as any),
                                    ) as Task[]
                                }
                                // listCellWidth={'0'}
                                fontFamily="'Rubik', sans-serif"
                                viewMode={viewMode}
                            /> */}
                            <ReactHighChart
                                highcharts={Highcharts}
                                options={options}
                                constructorType={'ganttChart'}
                            />
                            <HStack
                                justify="flex-end"
                                mr=".8rem"
                                display={view == 'daily' ? 'flex' : 'none'}
                            >
                                <Button
                                    onClick={() => {
                                        setLen((len) => len - 20);
                                    }}
                                    bgColor="brand.400"
                                    color="white"
                                    width="2rem"
                                    height="2rem"
                                    minW="unset"
                                    padding="0"
                                    borderRadius="50%"
                                    display={len <= 0 ? 'none' : 'flex'}
                                >
                                    <FaAngleLeft fontSize=".6rem" />
                                </Button>
                                <Button
                                    onClick={() => {
                                        setLen((len) => len + 20);
                                    }}
                                    bgColor="brand.400"
                                    color="white"
                                    width="2rem"
                                    height="2rem"
                                    minW="unset"
                                    padding="0"
                                    borderRadius="50%"
                                >
                                    <FaAngleRight fontSize=".6rem" />
                                </Button>
                            </HStack>
                        </Box>
                        <div className="cont"></div>
                    </HStack>
                ) : (
                    <HStack h="30vh" justify="center">
                        <Text>No data to show!!!</Text>
                    </HStack>
                )}
            </Box>
            {isOpen && (
                <AddNewTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    project={project}
                    data={data}
                    isEdit={false}
                    setData={setData}
                />
            )}
        </Box>
    );
};
