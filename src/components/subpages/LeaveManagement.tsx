import {
    Box,
    Button,
    Checkbox,
    DrawerFooter,
    Flex,
    Grid,
    Text,
    Icon as Icons,
    Tr,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import Pagination from '@components/bits-utils/Pagination';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import {
    TableData,
    LeaveActions,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from 'icon-picker-react';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { IconPickerItem } from 'react-icons-picker';
import {
    LeaveTypeViewPagedCollection,
    LeaveModel,
    LeaveService,
    LeaveView,
} from 'src/services';
import * as yup from 'yup';
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';
import { BsEye } from 'react-icons/bs';
import { ShowLeaveDetailsModal } from '@components/bits-utils/ShowLeaveDetailsModal';
import { UserContext } from '@components/context/UserContext';
import { ActivateUserAlert } from '@components/bits-utils/ActivateUserAlert';
import { DateObject } from 'react-multi-date-picker';
import getBusinessDateCount from '@components/bits-utils/GetBusinessDays';
import Leaveform from '@components/bits-utils/Leaveform';

interface leaveProps {
    leavelist: any;
    teamMembers: any;
    supervisor: any;
    leavetypes: LeaveTypeViewPagedCollection;
    id: string;
    type?: any;
}

export const LeaveManagement = ({
    leavelist,
    teamMembers,
    supervisor,
    leavetypes,
    id,
    type,
}: leaveProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [data, setDate] = useState<any>();
    const [isEdit, setIsEdit] = useState(false);

    const route = router.asPath;
    const role = user?.role.replaceAll(' ', '');
    const thead =
        role == 'TeamMember'
            ? [
                  'Leave Type',
                  'Work Assignee',
                  // 'Supervisor',
                  'Start Date',
                  'End Date',
                  'Total Hours',
                  'Status',
                  'Action',
              ]
            : role == 'Supervisor'
            ? [
                  'Employee',
                  'Leave Type',
                  'Work Assignee',
                  // 'Supervisor',
                  'Start Date',
                  'End Date',
                  'Total Hours',
                  'Status',
                  'Action',
              ]
            : [
                  'Employee',
                  'Leave Type',
                  'Work Assignee',
                  'Supervisor',
                  'Start Date',
                  'End Date',
                  'Total Hours',
                  'Status',
                  'Action',
              ];

    const openModal = (x) => {
        setDate(x);
        onOpens();
    };
    const openModals = (x) => {
        setDate(x);
        setIsEdit(true);
        onOpen();
    };

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <LeaveTab
                    tabValue={
                        role == 'TeamMember'
                            ? [
                                  {
                                      text: 'Leave Request',
                                      url: '/leave/management',
                                  },
                                  {
                                      text: 'Leave cancellation request',
                                      url: '/leave/cancelled',
                                  },
                                  {
                                      text: 'Leave History',
                                      url: '/leave/history',
                                  },
                              ]
                            : role == 'Supervisor' ||
                              role == 'Admin' ||
                              role == 'SuperAdmin'
                            ? [
                                  {
                                      text: 'Leave Application',
                                      url: '/leave/management',
                                  },
                                  {
                                      text: 'Leave cancellation request',
                                      url: '/leave/cancelled',
                                  },
                                  {
                                      text: 'Leave History',
                                      url: '/leave/history',
                                  },
                              ]
                            : [
                                  {
                                      text: 'Leave Application',
                                      url: '/leave/application',
                                  },
                                  {
                                      text: 'Leave Status',
                                      url: '/leave/management',
                                  },
                                  {
                                      text: 'Leave cancellation request',
                                      url: '/leave/cancelled',
                                  },
                                  {
                                      text: 'Leave History',
                                      url: '/leave/history',
                                  },
                              ]
                    }
                />
                <Flex justify="space-between" my="1rem">
                    {type == 'asTeam' && (
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            Apply for leave
                        </Button>
                    )}
                    {/* <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpens}
                        borderRadius="25px"
                    >
                        Download <Icon as={BsDownload} ml=".5rem" />
                    </Button> */}
                </Flex>
                <FilterSearch searchOptions="Search by: Name" />
                <Tables tableHead={thead}>
                    <>
                        {leavelist?.data?.value?.map((x: LeaveView) => (
                            <Tr key={x.id}>
                                {role !== 'TeamMember' && (
                                    <TableData
                                        name={
                                            x.employeeInformation?.user
                                                ?.fullName
                                        }
                                    />
                                )}

                                <td>
                                    <Flex align="center" gap=".5rem">
                                        <IconPickerItem
                                            value={x?.leaveType?.leaveTypeIcon}
                                            color="#2EAFA3"
                                        />
                                        {x?.leaveType?.name}
                                    </Flex>
                                </td>
                                <TableData name={x.workAssignee?.fullName} />
                                {(role == 'Admin' ||
                                    role == 'SuperAdmin' ||
                                    role == 'InternalSupervisor') && (
                                    <TableData
                                        name={
                                            x.employeeInformation?.supervisor
                                                ?.fullName
                                        }
                                    />
                                )}

                                <TableData name={formatDate(x?.startDate)} />
                                <TableData name={formatDate(x?.endDate)} />
                                {/* <TableData
                                    name={
                                        moment(x?.endDate).diff(
                                            moment(x?.startDate),
                                            'days',
                                        ) == 0
                                            ? '1 day'
                                            : `${
                                                  moment(x?.endDate).diff(
                                                      moment(x?.startDate),
                                                      'days',
                                                  ) + 1
                                              } days`
                                    }
                                /> */}
                                <TableData
                                    name={getBusinessDateCount(
                                        new Date(
                                            x?.startDate as unknown as Date,
                                        ),
                                        new Date(x?.endDate as unknown as Date),
                                    )}
                                />

                                <TableState
                                    name={
                                        x.status == 'REJECTED' &&
                                        (type == 'history' ||
                                            type == 'teamHistory')
                                            ? 'APPROVED'
                                            : x.status
                                    }
                                />

                                <LeaveActions
                                    id={x.id}
                                    route={route}
                                    click={() => openModal(x)}
                                    type={type}
                                    data={x}
                                    edit={() => openModals(x)}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={leavelist} />
            </Box>
            {isOpen && (
                <Leaveform
                    isOpen={isOpen}
                    isEdit={isEdit}
                    onClose={onClose}
                    data={data}
                    id={id}
                    leavetypes={leavetypes}
                    teamMembers={teamMembers}
                />
            )}
            {open && (
                <ShowLeaveDetailsModal
                    isOpen={open}
                    onClose={close}
                    data={data}
                    type={type}
                />
            )}
        </>
    );
};
