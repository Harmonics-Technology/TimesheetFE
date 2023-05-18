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

const schema = yup.object().shape({
    endDate: yup.string().required(),
    startDate: yup.string().required(),
    leaveTypeId: yup.string().required(),
    reasonForLeave: yup.string().required(),
    workAssigneeId: yup.string().required(),
});

interface leaveProps {
    leavelist: any;
    teamMembers: any;
    supervisor: any;
    leavetypes: LeaveTypeViewPagedCollection;
    id: string;
}

export const LeaveManagement = ({
    leavelist,
    teamMembers,
    supervisor,
    leavetypes,
    id,
}: leaveProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const { user } = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const [oneDay, setOneDay] = useState(false);
    const leaveDaysLeft =
        user?.numberOfDaysEligible != null && user?.numberOfDaysEligible != 0
            ? user?.numberOfDaysEligible - user?.numberOfLeaveDaysTaken
            : 0;
    console.log({
        teamMembers,
        supervisor,
    });
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LeaveModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            employeeInformationId: id,
        },
    });
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
                  'Total Days',
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
                  'Total Days',
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
                  'Total Days',
                  'Status',
                  'Action',
              ];
    const [data, setDate] = useState<any>();
    const openModal = (x) => {
        setDate(x);
        onOpens();
    };
    console.log(watch('leaveTypeId'));

    const onSubmit = async (data: LeaveModel) => {
        oneDay == true && (data.endDate = data.startDate);
        data.leaveTypeId = leavetypes.value?.filter(
            (x) => x.name == data.leaveTypeId,
        )[0].id;

        try {
            const result = await LeaveService.createLeave(data);
            if (result.status) {
                toast({
                    title: `Leave succesfully created, kindly await approval from your supervisor`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
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
                                      text: 'Leave Status',
                                      url: '/leave/management',
                                  },
                              ]
                            : role == 'Supervisor' || role == 'SuperAdmin'
                            ? [
                                  {
                                      text: 'Leave Application',
                                      url: '/leave/management',
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
                                      text: 'Leave History',
                                      url: '/leave/history',
                                  },
                              ]
                    }
                />
                <Flex justify="space-between" my="1rem">
                    {role != 'Supervisor' && role != 'SuperAdmin' && (
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
                                {role == 'SuperAdmin' && (
                                    <TableData
                                        name={
                                            x.employeeInformation?.supervisor
                                                ?.fullName
                                        }
                                    />
                                )}

                                <TableData name={formatDate(x?.startDate)} />
                                <TableData name={formatDate(x?.endDate)} />
                                <TableData
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
                                />

                                <TableState name={x.status} />

                                <LeaveActions
                                    id={x.id}
                                    route={route}
                                    click={() => openModal(x)}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={leavelist} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Leave Application'}
            >
                <ActivateUserAlert
                    desc={`PS: You have ${leaveDaysLeft} days free leave.`}
                    color="warning"
                />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SelectrixBox<LeaveModel>
                        control={control}
                        name="leaveTypeId"
                        error={errors.leaveTypeId}
                        keys="name"
                        keyLabel="leaveTypeIcon"
                        label="Leave Type"
                        options={leavetypes?.value}
                        renderOption={(option, index) => {
                            // console.log({ option });
                            return (
                                <Flex key={index} gap=".4rem">
                                    <IconPickerItem
                                        value={option.label}
                                        color="#2EAFA3"
                                    />
                                    {option.key}
                                </Flex>
                            );
                        }}
                        renderSelection={(selected, settings, deselect) => {
                            // console.log({ selected });
                            return (
                                <Box className="react-selectrix rs-toggle">
                                    <Flex gap=".4rem">
                                        <IconPickerItem
                                            value={selected?.label}
                                            color="#2EAFA3"
                                        />
                                        {selected?.key || 'Select a type'}
                                    </Flex>
                                </Box>
                            );
                        }}
                    />

                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                        mt="1.5rem"
                    >
                        <PrimaryDate<LeaveModel>
                            control={control}
                            name="startDate"
                            label={oneDay ? 'Leave Date' : 'Start Date'}
                            error={errors.startDate}
                            min={new DateObject().add(3, 'days')}
                        />
                        {!oneDay && (
                            <PrimaryDate<LeaveModel>
                                control={control}
                                name="endDate"
                                label="End Date"
                                error={errors.endDate}
                                min={new DateObject().add(4, 'days')}
                            />
                        )}
                    </Grid>
                    <Checkbox
                        size="sm"
                        mb="1.5rem"
                        onChange={(e) => setOneDay(e.target.checked)}
                    >
                        One day only
                    </Checkbox>
                    <VStack gap="1rem">
                        <PrimaryTextarea<LeaveModel>
                            label="Reason for leave"
                            name="reasonForLeave"
                            error={errors.reasonForLeave}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <SelectrixBox<LeaveModel>
                            control={control}
                            name="workAssigneeId"
                            error={errors.workAssigneeId}
                            keys="id"
                            keyLabel="fullName"
                            label="Work Assignee"
                            options={teamMembers?.data?.value}
                            searchable
                        />
                        {/* {role != 'TeamMember' && (
                            <SelectrixBox<LeaveModel>
                                control={control}
                                name="invoiceGenerationFrequency"
                                error={errors.invoiceGenerationFrequency}
                                keys="id"
                                keyLabel="fullName"
                                label="Supervisor"
                                options={supervisor?.value}
                                searchable
                            />
                        )} */}
                    </VStack>

                    <DrawerFooter mt="2rem" p="0">
                        <Flex justify="space-between" w="full">
                            <Button
                                bgColor="#FF5B79"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                px="2rem"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                px="2rem"
                                type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                <Box>Apply</Box>
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            <ShowLeaveDetailsModal isOpen={open} onClose={close} data={data} />
        </>
    );
};
