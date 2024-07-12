import { Avatar, Box, HStack, Td, Text, Tr } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import Pagination from '@components/bits-utils/Pagination';
import { ProgressBar } from '@components/bits-utils/ProjectManagement/Generics/ProgressBar';
import { TableData, TrainingActions } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { UserContext } from '@components/context/UserContext';
import { Round } from '@components/generics/functions/Round';
import React, { useContext } from 'react';
import { TrainingAssigneeView, TrainingView } from 'src/services';

export const TrainingStatus = ({ trainings }) => {
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
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
            <Box>
                <Tables
                    tableHead={[
                        'Name',
                        'Team Members',
                        'Progress Status',
                        'Action',
                    ]}
                >
                    <>
                        {trainings?.value?.map((x: TrainingView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <Td w="200px" paddingInlineStart="8px">
                                    <HStack gap="0">
                                        {x?.assignees
                                            ?.slice(0, 5)
                                            .map(
                                                (
                                                    x: TrainingAssigneeView,
                                                    i: any,
                                                ) => (
                                                    <Avatar
                                                        key={x.id}
                                                        size={'sm'}
                                                        name={
                                                            x?.user
                                                                ?.fullName as string
                                                        }
                                                        src={
                                                            x?.user
                                                                ?.profilePicture as string
                                                        }
                                                        border="1px solid white"
                                                        transform={`translateX(${
                                                            -i * 10
                                                        }px)`}
                                                    />
                                                ),
                                            )}
                                        {(x?.assignees?.length as any) > 5 && (
                                            <Text
                                                fontSize="0.75rem"
                                                color="#455A64"
                                                ml="-20px"
                                            >
                                                +{' '}
                                                {(x?.assignees?.length as any) -
                                                    5}
                                            </Text>
                                        )}
                                    </HStack>
                                </Td>
                                <Td w="250px" paddingInlineStart="8px">
                                    <ProgressBar
                                        barWidth={x?.progress}
                                        showProgress={true}
                                        barColor={'brand.400'}
                                        rightText={`${Round(x?.progress)}%`}
                                    />
                                </Td>
                                <TrainingActions
                                    viewOnly
                                    route={`/${role}/training/status/${x.id}?trainingName=${x.name}`}
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
