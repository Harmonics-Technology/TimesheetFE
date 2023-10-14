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
import {
    ProjectManagementService,
    ProjectModel,
    ProjectView,
} from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { Widget } from '@uploadcare/react-widget';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import moment from 'moment';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    duration: yup.string().required(),
    budget: yup.string().required(),
    assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    note: yup.string().required(),
    // documentURL: yup.string().required(),
});

export const EditProjectDrawer = ({
    onClose,
    isOpen,
    users,
    data,
}: {
    onClose: any;
    isOpen: boolean;
    users: any;
    data?: ProjectView;
}) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProjectModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId: data?.superAdminId,
            budget: data?.budget,
            budgetThreshold: data?.budgetThreshold,
            documentURL: data?.documentURL,
            duration: data?.duration,
            endDate: data?.endDate,
            id: data?.id,
            name: data?.name,
            note: data?.note,
            startDate: data?.startDate,
        },
    });
    const widgetApi = useRef<any>();
    const [fileDoc, setFileDoc] = useState<any>({
        loading: false,
        url: data?.documentURL ? { name: 'Uploaded File' } : '',
    });
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

    const assigneeWithTaskId = data?.assignees?.filter(
        (x) => x.projectTaskId === null,
    );
    const [selectedUser, setSelecedUser] = useState<any>(
        assigneeWithTaskId?.map((obj) => ({
            id: obj?.userId,
            fullName: obj?.user?.fullName,
        })) || [],
    );
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        console.log({ id });
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };

    const toast = useToast();
    const router = useRouter();
    console.log({ selectedUser, data, users, assigneeWithTaskId });

    //

    const onSubmit = async (data: ProjectModel) => {
        try {
            const result = await ProjectManagementService.updateProject(data);
            if (result.status) {
                toast({
                    title: result.message,
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

    const dateDiff = moment(watch('endDate')).diff(watch('startDate'), 'day');

    useEffect(() => {
        setValue('duration', dateDiff + 1 || 0);
    }, [watch('startDate'), watch('endDate')]);

    useEffect(() => {
        setValue(
            'assignedUsers',
            selectedUser.map((x) => x.id),
        );
    }, [selectedUser]);
    useEffect(() => {
        setValue('documentURL', fileDoc?.url?.cdnUrl);
    }, [fileDoc]);

    //
    return (
        <DrawerWrapper onClose={onClose} isOpen={isOpen} title={'Edit Project'}>
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
                            min={new DateObject()}
                            placeholder={moment(data?.startDate).format(
                                'DD/MM/YYYY',
                            )}
                        />

                        <PrimaryDate<ProjectModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            min={new DateObject().add(1, 'days')}
                            placeholder={moment(data?.endDate).format(
                                'DD/MM/YYYY',
                            )}
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
                    </Grid>
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
                        <Box
                            mt="1rem"
                            borderY="1px solid #e5e5e5"
                            w="full"
                            py="1rem"
                        >
                            {selectedUser?.length > 0 && (
                                <HStack mb=".5rem" flexWrap="wrap" w="full">
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
