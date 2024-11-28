import {
    Box,
    Button,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Text,
    Tr,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { TopBar } from '../Projects/SingleProject/TopBar';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { useRouter } from 'next/router';
import InputBlank from '@components/bits-utils/InputBlank';
import {
    ProjectView,
    ProjectTaskViewPagedCollection,
    ProjectManagementService,
    ProjectInvoiceModel,
    ProjectInvoiceRecipientModel,
    ProjectInvoiceView,
    ProjectInvoiceRecipientView,
} from 'src/services';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import Tables from '@components/bits-utils/Tables';
import { TableData } from '@components/bits-utils/TableData';
import { BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import shadeColor from '@components/generics/functions/shadeColor';
import { CustomDatePick } from '@components/bits-utils/CustomDatePick';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import calculatePercentage from '@components/generics/functions/calculatePercentage';
import moment from 'moment';
import { AddRecipientModal } from '../Modals/AddRecipientModal';
import generateRandomUUID from '@components/generics/generateRandomUUID';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import useOnClickOutside from '@components/generics/useClickOutside';

export const SummaryBox = ({
    label,
    value,
    cur,
    hst,
    onChange,
}: {
    label: string;
    value: string | number;
    cur: any;
    hst?: boolean;
    onChange?: any;
}) => {
    return (
        <HStack gap="1rem">
            <Text
                color="#263238"
                textTransform="capitalize"
                fontWeight="500"
                w="120px"
                textAlign="left"
                fontSize=".85rem"
            >
                {label}
            </Text>
            {hst ? (
                <InputBlank
                    variant="outline"
                    w="115px"
                    defaultValue="0"
                    value={value}
                    suffix={
                        <Text pos="absolute" right="15px" top="20%">
                            %
                        </Text>
                    }
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <Text
                    color="#263238"
                    fontSize="13px"
                    fontWeight="400"
                    w="115px"
                    textAlign="left"
                >
                    {cur}
                    {CUR(Round(value))}
                </Text>
            )}
        </HStack>
    );
};

interface TInvoiceItems {
    projectTaskId?: string;
    projectTaskName?: string;
    quantity?: number;
    cost?: number;
    totalCost?: number;
}
const schema = yup.object().shape({
    projectTaskId: yup.string(),
    projectTaskName: yup.string(),
    quantity: yup.string().required(),
    cost: yup.string().required(),
    totalCost: yup.string(),
});
const mainSchema = yup.object().shape({
    // notes: yup.string().required(),
    dueDate: yup.string().required(),
    issuedDate: yup.string().required(),
    recipientId: yup.string().required(),
    // posNumber: yup.string().required(),
});

export const CreateInvoice = ({
    id,
    project,
    tasks,
    users,
    invoice,
    superAdminId,
}: {
    id: string;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    users: ProjectInvoiceRecipientView[];
    invoice?: ProjectInvoiceView;
    superAdminId: string;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState<TInvoiceItems[]>(
        (invoice?.projectInvoiceItems as any) || [],
    );
    const [showForm, setShowForm] = useState(false);
    const toast = useToast();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const [hst, setHst] = useState(invoice?.hst);
    const [isExternal, setIsExternal] = useState(invoice ? true : false);

    const {
        handleSubmit,
        register,
        reset,
        watch,
        setValue,
        trigger: triggerItem,
        formState: { errors },
    } = useForm<TInvoiceItems>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            cost: 0,
            projectTaskId: '',
            projectTaskName: '',
            quantity: 0,
            totalCost: 0,
        },
    });
    const {
        handleSubmit: submitInvoice,
        register: registerInvoice,
        setValue: setInvoiceValue,
        trigger,
        watch: watchInvoice,
        control,
        formState: { errors: invoiceErrors, isSubmitting, isValid },
    } = useForm<ProjectInvoiceModel>({
        resolver: yupResolver(mainSchema),
        mode: 'all',
        defaultValues: {
            dueDate: invoice?.dueDate,
            notes: invoice?.notes,
            issuedDate: invoice?.issuedDate,
            posNumber: invoice?.posNumber,
            recipientId: invoice?.recipientId as string,
        },
    });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const totalCostPerItem =
        Number(watch('quantity') || 0) * Number(watch('cost') || 0);

    const subtotal = invoiceItems?.reduce(
        (a, b) => a + (b?.totalCost as number),
        0,
    );
    const convertedTax = Round(calculatePercentage(subtotal, Number(hst)));
    const finalTotal =
        Number((subtotal as number) || 0) + Number(convertedTax || 0);

    const [selectedTask, setSelectedTask] = useState<any>();
    const addTask = (task) => {
        setSelectedTask(task);
        setValue('projectTaskId', task?.id);
        triggerItem('projectTaskId');
    };

    const AddItemToList = (value: TInvoiceItems) => {
        triggerItem();
        value.projectTaskId = value?.projectTaskId || generateRandomUUID();
        value.projectTaskName =
            value?.projectTaskName ||
            (tasks?.value?.find((x) => x?.id === value.projectTaskId)
                ?.name as string);
        value.totalCost = totalCostPerItem;
        setInvoiceItems([...invoiceItems, value]);
        reset({});
        setSelectedTask('');
        setIsExternal(false);
        setShowForm(false);
    };
    const toggleEdit = (value: TInvoiceItems) => {
        setValue('cost', value.cost);
        setValue('totalCost', value.totalCost);
        setValue('projectTaskId', value.projectTaskId);
        setValue('quantity', value.quantity);
        setInvoiceItems(
            invoiceItems?.filter(
                (x) => x?.projectTaskId !== value?.projectTaskId,
            ),
        );
        setShowForm(true);
    };
    const deleteItem = (value) => {
        setInvoiceItems(
            invoiceItems?.filter(
                (x) => x?.projectTaskId !== value?.projectTaskId,
            ),
        );
    };

    const clickRef = useRef<any>();
    const handleClickOutside = useCallback(() => {
        handleSubmit(AddItemToList)();
    }, [clickRef]);
    useOnClickOutside(clickRef, handleClickOutside);

    const [selectedUser, setSelecedUser] = useState<any>(invoice?.recipient);
    const addUser = (rec) => {
        setSelecedUser(rec);
        setInvoiceValue('recipientId', rec?.id);
        trigger('recipientId');
        // setRecepientData(user?.key);
    };

    const filteredTasks = tasks?.value?.filter((task) => {
        const matchingItem = invoiceItems?.find(
            (item) => item.projectTaskId === task.id,
        );
        return !matchingItem;
    });

    const CreateAnInvoice = async (value: ProjectInvoiceModel) => {
        setLoading(true);
        if (invoiceItems?.length < 1) {
            toast({
                title: 'You must add atleast one task item to create an invoice',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        const requestBody: ProjectInvoiceModel = {
            invoiceItems,
            hst: hst,
            subtotal,
            total: finalTotal,
            dueDate: value.dueDate,
            issuedDate: value.issuedDate,
            notes: value.notes,
            projectId: id,
            recipientId: value.recipientId,
            superAdminId: superAdminId,
            id: invoice?.id,
            posNumber: value.posNumber,
        };
        try {
            const res = invoice
                ? await ProjectManagementService.updateInvoice(requestBody)
                : await ProjectManagementService.createInvoice(requestBody);
            if (res?.status) {
                router.push(
                    `/${role}/project-management/projects/${id}/invoices/${res?.data?.id}`,
                );
            }
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box pos="sticky" top="9.8%" zIndex={900} bgColor="#f6f7f8">
                <TopBar
                    currencies={undefined}
                    id={id}
                    data={undefined}
                    users={undefined}
                    noTop
                    noTitle
                />

                <HStack
                    fontSize=".875rem"
                    cursor="pointer"
                    onClick={() => router.back()}
                    bgColor="#f6f7f8"
                >
                    <Button bgColor="#f0f0f0" h="1.5rem" w="1.5rem" minW="0">
                        <Icon as={MdOutlineArrowBackIosNew} fontSize=".8rem" />
                    </Button>
                    <Text color="brand.400" fontWeight={500}>
                        Back
                    </Text>
                </HStack>
                <HStack
                    justify="space-between"
                    align="flex-start"
                    py="1rem"
                    bgColor="#f6f7f8"
                >
                    <Text fontWeight={600}>
                        {invoice ? 'Edit' : 'Create'} Invoice
                    </Text>
                </HStack>
            </Box>

            <Box pos="relative">
                <Box w={['full', '70%']}>
                    <Box
                        borderRadius="5px"
                        bgColor="white"
                        p="14px"
                        w="full"
                        mb="9px"
                    >
                        <Text color="#2D3748" fontWeight={600}>
                            Proinsight Consulting
                        </Text>
                        <Text color="#808080" fontWeight={400} fontSize="13px">
                            25 Sheppard, North York, ON M2N 6S6, Canada
                        </Text>
                    </Box>
                    <Box borderRadius="5px" bgColor="white" p="14px" mb="1rem">
                        <Text color="#2D3748" fontWeight={600}>
                            Invoice information
                        </Text>
                        <Grid
                            mt="19px"
                            gap="10px"
                            templateColumns="repeat(2, 1fr)"
                        >
                            <InputBlank
                                defaultValue={project?.name as string}
                                readonly={true}
                                fontSize="14px"
                                label="Project"
                            />
                            <PrimaryInput<ProjectInvoiceModel>
                                fontSize="14px"
                                label="P.O/S.O Number"
                                register={registerInvoice}
                                error={invoiceErrors.posNumber}
                                name="posNumber"
                                variant="outline"
                            />
                        </Grid>

                        <Box mt="27px">
                            <Tables
                                tableHead={[
                                    'Items',
                                    'Qty',
                                    'Cost',
                                    `Amount`,
                                    '',
                                ]}
                                bg="#E8F2F1"
                                variant="unset"
                                content='Start adding invoice item by clicking the "+ Add item" button'
                            >
                                {invoiceItems?.map((x) => (
                                    <Tr key={x?.projectTaskId}>
                                        <TableData name={x.projectTaskName} />
                                        <TableData name={x?.quantity} />
                                        <TableData name={x?.cost} />
                                        <TableData name={x?.totalCost} />
                                        <td>
                                            <HStack>
                                                <Icon
                                                    as={BsPenFill}
                                                    mr=".5rem"
                                                    color="#6A7F9D"
                                                    onClick={() =>
                                                        toggleEdit(x)
                                                    }
                                                />
                                                <Icon
                                                    as={BsTrash3Fill}
                                                    mr=".5rem"
                                                    color="#FF5B79"
                                                    onClick={() =>
                                                        deleteItem(x)
                                                    }
                                                />
                                            </HStack>
                                        </td>
                                    </Tr>
                                ))}
                            </Tables>
                        </Box>

                        {showForm && (
                            <HStack
                                gap="17px"
                                mt="2rem"
                                align="flex-start"
                                ref={clickRef}
                            >
                                {isExternal ? (
                                    <PrimaryInput<TInvoiceItems>
                                        label="Task Name"
                                        error={errors.projectTaskName}
                                        register={register}
                                        name="projectTaskName"
                                        variant="outline"
                                        w="40%"
                                    />
                                ) : (
                                    <Box w="40%">
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Task Name
                                        </FormLabel>

                                        <CustomSelectBox
                                            data={filteredTasks}
                                            updateFunction={addTask}
                                            items={selectedTask}
                                            error={errors?.projectTaskId}
                                            customKeys={{
                                                key: 'id',
                                                label: 'name',
                                            }}
                                            single
                                            id="tasks"
                                            extension={
                                                <HStack
                                                    justify="center"
                                                    color="brand.400"
                                                    p=".5rem .7rem"
                                                    bgColor={shadeColor(
                                                        '#2EAFA3',
                                                        0.06,
                                                    )}
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        setIsExternal(true)
                                                    }
                                                >
                                                    <Icon
                                                        as={AiOutlinePlusCircle}
                                                    />
                                                    <Text fontSize="13px">
                                                        Add a new Task
                                                    </Text>
                                                </HStack>
                                            }
                                        />
                                    </Box>
                                )}
                                <PrimaryInput<TInvoiceItems>
                                    label="Qty"
                                    error={errors.quantity}
                                    register={register}
                                    name="quantity"
                                    variant="outline"
                                    w="15%"
                                />
                                <PrimaryInput<TInvoiceItems>
                                    label="Cost"
                                    error={errors.cost}
                                    register={register}
                                    name="cost"
                                    variant="outline"
                                    w="15%"
                                    prefix={
                                        <Text
                                            pos="absolute"
                                            top="28%"
                                            left="5px"
                                            fontSize="13px"
                                        >
                                            $
                                        </Text>
                                    }
                                />
                                <InputBlank
                                    label="Amount"
                                    value={totalCostPerItem}
                                    w="15%"
                                    readonly={true}
                                    variant="unset"
                                    prefix={
                                        <Text
                                            pos="absolute"
                                            top="28%"
                                            left="5px"
                                            fontSize="13px"
                                            zIndex={100}
                                        >
                                            $
                                        </Text>
                                    }
                                />

                                <Text
                                    fontSize="13px"
                                    color="brand.400"
                                    mt="2.3rem"
                                    fontWeight={700}
                                    cursor="pointer"
                                    onClick={() =>
                                        handleSubmit(AddItemToList)()
                                    }
                                >
                                    ✔ Add
                                </Text>
                            </HStack>
                        )}

                        <Box
                            pb="10px"
                            borderBottom="1px solid #dddddd"
                            w="full"
                            mt="23px"
                        >
                            <HStack
                                color="brand.400"
                                cursor="pointer"
                                onClick={() => setShowForm((prev) => !prev)}
                            >
                                <Icon
                                    as={
                                        showForm
                                            ? AiOutlineMinusCircle
                                            : AiOutlinePlusCircle
                                    }
                                />
                                <Text fontSize="13px">
                                    {showForm ? 'Close' : 'Add Item'}
                                </Text>
                            </HStack>
                        </Box>

                        <VStack align="flex-end" my="13px">
                            <SummaryBox
                                label="Subtotal"
                                cur={'$'}
                                value={subtotal}
                            />
                            <SummaryBox
                                label="HST"
                                cur={'$'}
                                value={hst as number}
                                hst
                                onChange={setHst}
                            />
                            <SummaryBox
                                label="Total"
                                cur={'$'}
                                value={finalTotal}
                            />
                        </VStack>
                        <PrimaryTextarea<ProjectInvoiceModel>
                            fontSize="14px"
                            label="Notes/Terms"
                            register={registerInvoice}
                            error={invoiceErrors.notes}
                            name="notes"
                            variant="outline"
                            h="90px"
                        />
                    </Box>

                    <ManageBtn
                        bg="brand.400"
                        btn={
                            invoice
                                ? 'Update and Continue'
                                : 'Save and Continue'
                        }
                        h="40px"
                        w="fit-content"
                        isLoading={isSubmitting}
                        // disabled={!isValid}
                        onClick={submitInvoice(CreateAnInvoice)}
                        fontSize="1rem"
                    />
                </Box>
                <Box
                    pos={['static', 'fixed']}
                    top={'29%'}
                    w={['full', '22.8%']}
                    bgColor="white"
                    // boxShadow="md"
                    borderRadius="5px"
                    right="2rem"
                    p="1rem .8rem 3rem"
                    mt={['1rem', '0']}
                    h={'fit-content'}
                    // overflow="auto"
                >
                    <Text color="#2D3748" fontWeight={600}>
                        Recipient information
                    </Text>

                    <Box mt="23px">
                        {/* {isExternal ? (
                            <Box>
                                <InputBlank
                                    fontSize="14px"
                                    label="Customer"
                                    onChange={(e) =>
                                        setRecepientData({
                                            ...recipientData,
                                            organizationName: e.target.value,
                                        })
                                    }
                                    value={recipientData?.organizationName}
                                    variant="outline"
                                    placeholder="Organization name or person"
                                />
                                <Grid
                                    mt="19px"
                                    gap="10px"
                                    templateColumns="repeat(2, 1fr)"
                                >
                                    <InputBlank
                                        fontSize="14px"
                                        label="Email"
                                        onChange={(e) =>
                                            setRecepientData({
                                                ...recipientData,
                                                email: e.target.value,
                                            })
                                        }
                                        value={recipientData?.email}
                                        variant="outline"
                                    />
                                    <InputBlank
                                        fontSize="14px"
                                        label="Phone (Optional)"
                                        onChange={(e) =>
                                            setRecepientData({
                                                ...recipientData,
                                                phone: e.target.value,
                                            })
                                        }
                                        value={recipientData?.phone}
                                        variant="outline"
                                    />
                                </Grid>
                                <InputBlank
                                    fontSize="14px"
                                    label="Address"
                                    onChange={(e) =>
                                        setRecepientData({
                                            ...recipientData,
                                            address: e.target.value,
                                        })
                                    }
                                    value={recipientData?.address}
                                    variant="outline"
                                    isTextArea
                                    h="90px"
                                    placeholder="Enter full address"
                                />
                            </Box>
                        ) : ( */}
                        <Box w="full">
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Bill To
                            </FormLabel>

                            <CustomSelectBox
                                data={users?.sort((a, b) =>
                                    (a.organizationName as any)?.localeCompare(
                                        b.organizationName as any,
                                    ),
                                )}
                                updateFunction={addUser}
                                items={selectedUser}
                                error={invoiceErrors?.recipientId}
                                customKeys={{
                                    key: 'id',
                                    label: 'organizationName',
                                    used: 'organizationAddress',
                                    total: 'email',
                                    phone: 'phoneNumber',
                                }}
                                single
                                id="Recipient"
                                extraField
                                extra
                                searchable
                                extension={
                                    <HStack
                                        justify="center"
                                        color="brand.400"
                                        p=".5rem .7rem"
                                        bgColor={shadeColor('#2EAFA3', 0.06)}
                                        cursor="pointer"
                                        onClick={onOpen}
                                    >
                                        <Icon as={AiOutlinePlusCircle} />
                                        <Text fontSize="13px">Add</Text>
                                    </HStack>
                                }
                            />
                        </Box>
                        {/* )} */}
                        {/* <HStack justify="flex-end" mt=".2rem">
                            <Text
                                fontSize="13px"
                                color="brand.400"
                                p=".3rem .7rem"
                                bgColor={shadeColor('#2EAFA3', 0.06)}
                                cursor="pointer"
                                onClick={() => setIsExternal((prev) => !prev)}
                            >
                                {!isExternal
                                    ? 'Not on the list? Add a new client'
                                    : 'Select from Existing clients'}
                            </Text>
                        </HStack> */}

                        <Grid
                            mt="19px"
                            gap="10px"
                            templateColumns="repeat(2, 1fr)"
                        >
                            <PrimaryDate<ProjectInvoiceModel>
                                label="Issued Date"
                                name="issuedDate"
                                error={invoiceErrors.issuedDate}
                                placeholder=""
                                defaultValue={
                                    invoice
                                        ? moment(invoice?.issuedDate).format(
                                              'YYYY/MM/DD',
                                          )
                                        : ''
                                }
                                control={control}
                            />
                            <PrimaryDate<ProjectInvoiceModel>
                                label="Due Date"
                                name="dueDate"
                                error={invoiceErrors.dueDate}
                                placeholder=""
                                min={
                                    new Date(watchInvoice('issuedDate') as any)
                                }
                                defaultValue={
                                    invoice
                                        ? moment(invoice?.dueDate).format(
                                              'YYYY/MM/DD',
                                          )
                                        : ''
                                }
                                control={control}
                            />
                            {/* <CustomDatePick
                                setDate={setIssuedDate}
                                date={issuedDate}
                                label="Issued Date"
                                format="DD/MM/YYYY"
                            />
                            <CustomDatePick
                                setDate={setDueDate}
                                date={dueDate}
                                label="Due Date"
                                format="DD/MM/YYYY"
                            /> */}
                        </Grid>
                    </Box>
                </Box>
            </Box>
            {isOpen && (
                <AddRecipientModal
                    isOpen={isOpen}
                    onClose={onClose}
                    superAdminId={superAdminId}
                />
            )}
        </Box>
    );
};
