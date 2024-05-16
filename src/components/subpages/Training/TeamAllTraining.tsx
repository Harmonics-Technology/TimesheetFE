import { Box, Td, Text, Tr } from '@chakra-ui/react';
import Pagination from '@components/bits-utils/Pagination';
import { TableData, TrainingActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import { TrainingMaterialView } from 'src/services';
import { useContext } from 'react';
import { UserContext } from '@components/context/UserContext';
import { ProgressBar } from '@components/bits-utils/ProjectManagement/Generics/ProgressBar';

export const TeamAllTraning = ({ trainings }) => {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Text fontWeight={500} color="#000">
                Training Materials
            </Text>
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
                        {trainings?.value?.map(
                            (x: TrainingMaterialView, i: number) => (
                                <Tr key={i}>
                                    <TableData name={x.name} />
                                    <TableData name={x.noOfTrainingFile} />
                                    <Td w="250px" paddingInlineStart="8px">
                                        <ProgressBar
                                            barWidth={x?.progress}
                                            showProgress={true}
                                            barColor={'brand.400'}
                                            rightText={x?.progress}
                                        />
                                    </Td>
                                    <TableData
                                        name={formatDate(x.dateCompleted)}
                                    />
                                    <TrainingActions
                                        viewOnly
                                        id={''}
                                        route={`/${role}/training/status/${x.name}`}
                                    />
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
                <Pagination data={trainings} />
            </Box>
        </Box>
    );
};
