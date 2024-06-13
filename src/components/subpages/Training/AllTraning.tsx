import { Box, Button, Flex, Tr, useDisclosure } from '@chakra-ui/react';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import Pagination from '@components/bits-utils/Pagination';
import { TableData, TrainingActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import { AddTrainingModal } from './AddTrainingModal';
import { TrainingView } from 'src/services';
import { useContext } from 'react';
import { UserContext } from '@components/context/UserContext';

export const AllTraning = ({ users, superAdminId, trainings }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Training Materials',
                            url: `/training`,
                        },
                        {
                            text: 'Training Status',
                            url: `/training/status`,
                        },
                    ]}
                />
            </Box>
            <Flex align="center" justify="space-between" mb="1rem">
                <Button
                    bgColor="brand.400"
                    color="white"
                    p="0rem 1rem"
                    height="30px"
                    fontSize="12px"
                    onClick={onOpen}
                    borderRadius="5px"
                >
                    Add Training
                </Button>
                <FilterSearch noFilter />
            </Flex>
            <Box>
                <Tables tableHead={['Name', 'Date', 'Action']}>
                    <>
                        {trainings?.value?.map((x: TrainingView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData name={formatDate(x.dateCreated)} />
                                <TrainingActions
                                    id={x.id}
                                    route={`/${role}/training/${x.id}`}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={trainings} />
            </Box>
            {isOpen && (
                <AddTrainingModal
                    isOpen={isOpen}
                    onClose={onClose}
                    superAdminId={superAdminId}
                    users={users}
                />
            )}
        </Box>
    );
};
