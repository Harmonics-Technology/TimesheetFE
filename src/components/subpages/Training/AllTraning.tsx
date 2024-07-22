import {
    Box,
    Button,
    Flex,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import Pagination from '@components/bits-utils/Pagination';
import { TableData, TrainingActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import { AddTrainingModal } from './AddTrainingModal';
import { TrainingService, TrainingView } from 'src/services';
import { useContext, useState } from 'react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import { ShowPrompt } from '@components/bits-utils/ProjectManagement/Modals/ShowPrompt';

export const AllTraning = ({ users, superAdminId, trainings, tabs }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const [loading, setLoading] = useState({ id: '' });
    const [fileId, setFileId] = useState('');
    const {
        isOpen: opens,
        onOpen: onOpened,
        onClose: onCloses,
    } = useDisclosure();
    const toast = useToast();
    const router = useRouter();
    const deleteTraining = async () => {
        onCloses();
        setLoading({ id: fileId });
        try {
            const result = await TrainingService.deleteTraining(fileId);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
                router.replace(router.asPath);
                return;
            }
            setLoading({ id: '' });
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            setLoading({ id: '' });
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const openDeleteModal = (fileId: any) => {
        onOpened();
        setFileId(fileId);
    };
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
                                    route={
                                        tabs?.length == 2
                                            ? `/${role}/training/${x.id}`
                                            : `/${role}/training/material/${x.id}`
                                    }
                                    deleteTraining={() => openDeleteModal(x.id)}
                                    loading={loading.id === x?.id}
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
            {opens && (
                <ShowPrompt
                    isOpen={opens}
                    onClose={onCloses}
                    onSubmit={deleteTraining}
                    loading={loading.id === fileId}
                    text={`Are you sure you want to delete this training? This action cannot be undone.`}
                />
            )}
        </Box>
    );
};
