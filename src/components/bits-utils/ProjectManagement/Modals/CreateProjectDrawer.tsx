import {
    Box,
    Button,
    DrawerFooter,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import BeatLoader from 'react-spinners/BeatLoader';
import { ProjectManagementService, ProjectModel } from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { Widget } from '@uploadcare/react-widget';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import moment from 'moment';
import { useRouter } from 'next/router';
import Checkbox from '@components/bits-utils/Checkbox';
import Link from 'next/link';
import { UserContext } from '@components/context/UserContext';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { getCurrencyName } from '@components/generics/functions/getCurrencyName';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';
import getBusinessDateCount from '@components/bits-utils/GetBusinessDays';

export const CreateProjectDrawer = ({
    onClose,
    isOpen,
    users,
    superAdminId,
    projectMangers,
    currencies,
}) => {
    const [currentBudget, setCurrenntBudget] = useState(0);
    const [nonApplicable, setNonApplicable] = useState(false);

    const uniqueItems = getUniqueListBy(currencies, 'currency');

    const schema = yup.object().shape({
        name: yup.string().required(),
        startDate: yup.string().required(),
        endDate: yup.string().required(),
        duration: yup.string().required(),
        budget: yup.number().required(),
        budgetThreshold: yup.number().required().max(currentBudget),
        assignedUsers: yup
            .array()
            .min(1, 'Select atleast one assignee')
            .required(),
        note: yup.string().required(),
        projectMangers: nonApplicable
            ? yup.string()
            : yup
                  .array()
                  .min(1, 'Select atleast one project manager')
                  .required(),
        // documentURL: yup.string().required(),
    });

    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProjectModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId,
        },
    });
    const widgetApi = useRef<any>();
    const [fileDoc, setFileDoc] = useState<any>({ loading: false, url: '' });
    const uploadFunction = (file) => {
        if (file) {
            file.progress((info) => {
                setFileDoc({ loading: true });
            });
            file.done((info) => {
                setFileDoc({ loading: false, url: info });
            });
        }
    };
    const [selectedUser, setSelecedUser] = useState<any>([]);
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };
    const [selectedManager, setSelectedManager] = useState<any>([]);
    const addManager = (user) => {
        const filtered = selectedManager?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelectedManager([...selectedManager, user]);
    };
    const removeManager = (id) => {
        const filtered = selectedManager?.filter((x) => x.id !== id);
        setSelectedManager(filtered);
    };

    const toast = useToast();
    const router = useRouter();

    const setIfNonApplicable = (value: any) => {
        setNonApplicable(value);
        if (value == true) {
            setSelectedManager(undefined);
            return;
        }
    };

    //

    const onSubmit = async (data: ProjectModel) => {
        try {
            const result = await ProjectManagementService.createProject(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
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

    // const dateDiff = moment(watch('endDate')).diff(watch('startDate'), 'day');
    const businessDays = getBusinessDateCount(
        new Date(watch('startDate') as any),
        new Date(watch('endDate') as any),
    );
    // console.log({ businessDays, st: watch('startDate'), en: watch('endDate') });

    useEffect(() => {
        setValue('duration', businessDays || 0);
    }, [watch('startDate'), watch('endDate')]);

    const budget = watch('budget');
    useEffect(() => {
        setCurrenntBudget(budget as number);
    }, [budget]);

    useEffect(() => {
        setValue(
            'assignedUsers',
            selectedUser.map((x) => x.id),
        );
    }, [selectedUser]);
    useEffect(() => {
        setValue(
            'projectManagers',
            selectedManager.map((x) => x.id),
        );
    }, [selectedManager]);
    useEffect(() => {
        setValue('documentURL', fileDoc?.url?.cdnUrl);
    }, [fileDoc]);
    // useEffect(() => {
    //     setValue('projectManagerId', selectedManager?.id);
    // }, [selectedManager]);

    //
    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Create A New Project'}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1rem">
                    <PrimaryInput<ProjectModel>
                        label="Project Name"
                        name="name"
                        error={errors.name}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                        gap="1rem 1rem"
                    >
                        <PrimaryDate<ProjectModel>
                            control={control}
                            name="startDate"
                            label="Start Date"
                            error={errors.startDate}
                            // min={new DateObject()}
                        />

                        <PrimaryDate<ProjectModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            // min={new DateObject().add(1, 'days')}
                        />

                        <PrimaryInput<ProjectModel>
                            label="Duration"
                            name="duration"
                            error={errors.duration}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            readonly={true}
                        />
                        <PrimarySelect<ProjectModel>
                            register={register}
                            error={errors.currency}
                            name="currency"
                            label="Currency"
                            placeholder="Select Currency"
                            defaultValue={'CAD'}
                            options={
                                <>
                                    {uniqueItems
                                        ?.sort((a, b) =>
                                            a?.currency?.localeCompare(
                                                b?.currency,
                                            ),
                                        )
                                        .map((x) => (
                                            <option value={x?.currency}>
                                                {x?.currency} (
                                                {getCurrencyName(x?.currency) ||
                                                    x?.name}
                                                )
                                            </option>
                                        ))}
                                </>
                            }
                        />
                        <PrimaryInput<ProjectModel>
                            label="Budget"
                            name="budget"
                            error={errors.budget}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryInput<ProjectModel>
                            label="Budget Threshold"
                            name="budgetThreshold"
                            error={errors.budgetThreshold}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                    </Grid>

                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Assign this Project to
                        </FormLabel>

                        <CustomSelectBox
                            data={users?.value}
                            updateFunction={addUser}
                            items={selectedUser}
                            customKeys={{ key: 'id', label: 'fullName' }}
                            removeFn={removeUser}
                            id="Assign user"
                            error={errors.assignedUsers}
                        />
                        <HStack justify="flex-end" mt=".5rem">
                            <Link
                                passHref
                                href={`/${role}/profile-management/team-members`}
                            >
                                <Button
                                    bgColor="#2383BD"
                                    px="1rem"
                                    h="24px"
                                    color="white"
                                    fontSize="10px"
                                >
                                    Add Team Member
                                </Button>
                            </Link>
                        </HStack>
                        <Box
                            mt="1rem"
                            borderY="1px solid #e5e5e5"
                            w="full"
                            py="1rem"
                        >
                            {selectedUser?.length > 0 && (
                                <HStack mb=".5rem">
                                    {selectedUser?.map((x: any, i: any) => (
                                        <HStack
                                            borderRadius="25px"
                                            border="1px solid #e5e5e5"
                                            fontSize=".6rem"
                                            color="#707683"
                                            key={i}
                                            p=".1rem .4rem"
                                        >
                                            <Text
                                                fontSize=".6rem"
                                                color="#707683"
                                                mb="0"
                                            >
                                                {x?.fullName}
                                            </Text>
                                            <Icon
                                                as={MdCancel}
                                                onClick={() =>
                                                    removeUser(x?.id)
                                                }
                                            />
                                        </HStack>
                                    ))}
                                </HStack>
                            )}
                            <Text fontSize=".6rem" color="#707683" mb="0">
                                These team members were added to this project
                            </Text>
                        </Box>
                    </Box>
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Assign Project Manager
                        </FormLabel>

                        <CustomSelectBox
                            data={projectMangers?.value}
                            updateFunction={addManager}
                            items={selectedManager}
                            customKeys={{ key: 'id', label: 'fullName' }}
                            removeFn={removeManager}
                            id="AssignProjectManager"
                            error={errors.projectManagers}
                        />
                        <Box
                            mt="1rem"
                            borderY="1px solid #e5e5e5"
                            w="full"
                            py="1rem"
                        >
                            {selectedManager?.length > 0 && (
                                <HStack mb=".5rem">
                                    {selectedManager?.map((x: any, i: any) => (
                                        <HStack
                                            borderRadius="25px"
                                            border="1px solid #e5e5e5"
                                            fontSize=".6rem"
                                            color="#707683"
                                            key={i}
                                            p=".1rem .4rem"
                                        >
                                            <Text
                                                fontSize=".6rem"
                                                color="#707683"
                                                mb="0"
                                            >
                                                {x?.fullName}
                                            </Text>
                                            <Icon
                                                as={MdCancel}
                                                onClick={() =>
                                                    removeManager(x?.id)
                                                }
                                            />
                                        </HStack>
                                    ))}
                                </HStack>
                            )}
                            <Text fontSize=".6rem" color="#707683" mb="0">
                                These team members were added as a manager to
                                this project
                            </Text>
                        </Box>
                        <Box mt="1rem">
                            <Checkbox
                                label="Not Applicable"
                                dir="rtl"
                                color="black"
                                onChange={(e: any) =>
                                    setIfNonApplicable(e.target.checked)
                                }
                            />
                        </Box>
                    </Box>
                    <PrimaryInput<ProjectModel>
                        label="Notes"
                        name="note"
                        error={errors.note}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Upload Document or Requirement
                        </FormLabel>
                        <Flex
                            border={
                                errors?.documentURL?.type === 'required'
                                    ? '1px dashed red'
                                    : '1px dashed #9e9e9e'
                            }
                            h="9rem"
                            align="center"
                            justify="center"
                            w="full"
                        >
                            <VStack
                                color="black"
                                fontSize=".8rem"
                                align="center"
                                cursor="pointer"
                                fontWeight="600"
                                onClick={() => widgetApi.current.openDialog()}
                            >
                                <Icon
                                    as={AiOutlineCloudUpload}
                                    fontSize="2rem"
                                />
                                <Text noOfLines={1} mb="0">
                                    Upload
                                </Text>
                                <Text noOfLines={1} mb="0">
                                    Drag and drop or Browse
                                </Text>
                            </VStack>
                            <Box display="none">
                                <Widget
                                    publicKey="fda3a71102659f95625f"
                                    clearable
                                    onFileSelect={uploadFunction}
                                    ref={widgetApi}
                                    systemDialog={true}
                                    inputAcceptTypes={'.docx,.pdf, .doc'}
                                />
                            </Box>
                        </Flex>
                    </Box>
                    <FormControl
                        isInvalid={
                            errors?.documentURL?.type === 'required' ||
                            errors?.documentURL?.message !== undefined
                        }
                    >
                        <Flex
                            bgColor="#C2CFE0"
                            borderRadius="25px"
                            border={
                                errors?.documentURL?.type === 'required'
                                    ? '1px solid red'
                                    : '1px solid #C2CFE0'
                            }
                            h="1.6rem"
                            px="1.5rem"
                            fontSize=".6rem"
                            color="white"
                            justify="center"
                            align="center"
                            w="fit-content"
                        >
                            {fileDoc?.loading ? (
                                <Spinner size="sm" />
                            ) : !fileDoc?.loading && fileDoc?.url !== '' ? (
                                fileDoc?.url?.name
                            ) : (
                                ' PDF DOC'
                            )}
                        </Flex>
                        <FormErrorMessage fontSize=".7rem" color="red">
                            {(errors?.documentURL?.type === 'required' &&
                                `Document Url is required`) ||
                                errors?.documentURL?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <DrawerFooter my="2rem" p="0" w="full">
                        <Flex justify="space-between" w="full">
                            <Button
                                bgColor="#FF5B79"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Save
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </VStack>
            </form>
        </DrawerWrapper>
    );
};
