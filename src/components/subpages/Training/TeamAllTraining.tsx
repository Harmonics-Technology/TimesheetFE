import { Box, Td, Text, Tr } from '@chakra-ui/react';
import Pagination from '@components/bits-utils/Pagination';
import { TableData, TrainingActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import { TrainingMaterialView } from 'src/services';
import { useContext } from 'react';
import { UserContext } from '@components/context/UserContext';
import { ProgressBar } from '@components/bits-utils/ProjectManagement/Generics/ProgressBar';
import { Round } from '@components/generics/functions/Round';
import { LeaveTab } from '@components/bits-utils/LeaveTab';

export const TeamAllTraning = ({ trainings, tabs }) => {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');

    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Box w="full" mb="1rem">
                <LeaveTab tabValue={tabs} />
            </Box>
            <Box>
                <Tables
                    tableHead={[
                        'Name',
                        'No of Training File',
                        'Progress status',
                        'Date completed',
                        'Action',
                    ]}
                >
                    <>
                        {trainings?.value?.map((x: TrainingMaterialView) => (
                            <Tr key={x.trainingId}>
                                <TableData name={x.name} />
                                <TableData name={x.noOfTrainingFile} />
                                <Td w="250px" paddingInlineStart="8px">
                                    <ProgressBar
                                        barWidth={x?.progress}
                                        showProgress={true}
                                        barColor={'brand.400'}
                                        rightText={`${Round(
                                            x?.progress || 0,
                                        )}%`}
                                    />
                                </Td>
                                <TableData
                                    name={
                                        x?.status?.toLowerCase() == 'completed'
                                            ? formatDate(x?.dateCompleted)
                                            : x?.status?.toLowerCase() ==
                                              'ongoing'
                                            ? 'Ongoing'
                                            : 'Not started'
                                    }
                                />
                                <TrainingActions
                                    viewOnly
                                    route={`/${role}/training/${x.trainingId}`}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={trainings} />
            </Box>
        </Box>
    );
};
