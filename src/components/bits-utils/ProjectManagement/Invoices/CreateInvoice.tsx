import {
    Box,
    Button,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Td,
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
        <HStack gap="1rem" py=".3rem">
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
    const [isExternal, setIsExternal] = useState({ id: '' });

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
        defaultValues: {},
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
        setIsExternal({ id: '' });
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
    const handleClickOutside = () => {
        handleSubmit(AddItemToList)();
    };
    useOnClickOutside(clickRef, handleClickOutside);

    const [selectedUser, setSelecedUser] = useState<any>(invoice?.recipient);
    const addUser = (rec) => {
        setSelecedUser(rec);
        setInvoiceValue('recipientId', rec?.id);
        trigger('recipientId');
        // setRecepientData(user?.key);
    };

    const [lineItems, setLineItems] = useState<any>(
        (invoice?.projectInvoiceItems as any) || [
            {
                projectTaskId: '',
                projectTaskName: '',
                quantity: 0,
                cost: 0,
                totalCost: 0,
            },
        ],
    );

    const subtotal = lineItems?.reduce(
        (a, b) => a + (b?.totalCost as number),
        0,
    );
    const convertedTax = Round(calculatePercentage(subtotal, Number(hst)));
    const finalTotal =
        Number((subtotal as number) || 0) + Number(convertedTax || 0);

    const handleAddLineItem = () => {
        setLineItems([
            ...lineItems,
            {
                projectTaskName: '',
                projectTaskId: '',
                quantity: 0,
                cost: 0,
                totalCost: 0,
            },
        ]);
    };

    const handleFieldChange = (
        index: number,
        updates: Partial<{ [field: string]: string | number }>,
    ) => {
        const updatedItems = [...lineItems];
        updatedItems[index] = {
            ...updatedItems[index],
            ...updates,
        };

        if ('quantity' in updates) {
            updatedItems[index].quantity = Round(
                Number(updatedItems[index].quantity),
            );
        }

        // Recalculate the amount if quantity or cost changes
        if ('quantity' in updates || 'cost' in updates) {
            updatedItems[index].totalCost =
                Round(Number(updatedItems[index].quantity)) *
                Number(updatedItems[index].cost);
        }

        setLineItems(updatedItems);
    };

    // console.log({ lineItems });

    const handleDeleteLineItem = (index: number) => {
        const updatedItems = lineItems.filter((_, i) => i !== index);
        setLineItems(updatedItems);
    };

    const [selectedTask, setSelectedTask] = useState<any>();
    const addTask = (task, index) => {
        // console.log({ index, task });
        setSelectedTask(task);
        const projectName = tasks?.value?.find((x) => x?.id === task?.id)?.name;

        handleFieldChange(index, {
            projectTaskId: task?.id,
            projectTaskName: projectName as string,
            quantity: task?.email,
        });
        // setValue('projectTaskId', task?.id);
        // triggerItem('projectTaskId');
    };

    const filteredTasks = tasks?.value?.filter((task) => {
        const matchingItem = lineItems?.find(
            (item) => item.projectTaskId === task.id,
        );
        return !matchingItem;
    });

    const CreateAnInvoice = async (value: ProjectInvoiceModel) => {
        setLoading(true);
        if (lineItems?.length < 1) {
            toast({
                title: 'You must add atleast one task item to create an invoice',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        const requestBody: ProjectInvoiceModel = {
            invoiceItems: lineItems,
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
            organization: selectedUser?.organizationName,
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
                title: error?.body?.title || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    // console.log({ selectedUser });

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
                            {user?.organizationName}
                        </Text>
                        <Text color="#808080" fontWeight={400} fontSize="13px">
                           {user?.organizationAddress}
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
                                overflow="unset"
                                content='Start adding invoice item by clicking the "+ Add item" button'
                            >
                                {/* {invoiceItems?.map((x) => (
                                    <Tr key={x?.projectTaskId}>
                                        <TableData name={x.projectTaskName} />
                                        <TableData name={x?.quantity} />
                                        <TableData name={x?.cost} />
                                        <TableData name={x?.totalCost} />
                                        <td style={{ width: '20px' }}>
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
                                ))} */}
                                {lineItems.map((item, index) => (
                                    <Tr key={index} gap="17px">
                                        {/* Task Name */}
                                        <Td w="45%" paddingInlineStart="0rem">
                                            {item.index === index ? (
                                                <InputBlank
                                                    value={item.taskName}
                                                    placeholder="Enter task name"
                                                    variant="outline"
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            index,
                                                            {
                                                                projectTaskName:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <CustomSelectBox
                                                    data={filteredTasks}
                                                    updateFunction={addTask}
                                                    items={{
                                                        id: item.projectTaskId,
                                                        name: item.projectTaskName,
                                                    }}
                                                    customKeys={{
                                                        key: 'id',
                                                        label: 'name',
                                                        total: 'hoursSpent',
                                                    }}
                                                    single
                                                    id="tasks"
                                                    extra={index}
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
                                                                handleFieldChange(
                                                                    index,
                                                                    {
                                                                        index,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <Icon
                                                                as={
                                                                    AiOutlinePlusCircle
                                                                }
                                                            />
                                                            <Text fontSize="13px">
                                                                Add a new Task
                                                            </Text>
                                                        </HStack>
                                                    }
                                                />
                                            )}
                                        </Td>

                                        {/* Quantity */}
                                        <Td w="15%" paddingInlineStart="1rem">
                                            <InputBlank
                                                type="number"
                                                value={item.quantity}
                                                placeholder="0"
                                                variant="outline"
                                                onChange={(e) =>
                                                    handleFieldChange(index, {
                                                        quantity:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </Td>

                                        {/* Cost */}
                                        <Td w="15%" paddingInlineStart="1rem">
                                            <InputBlank
                                                type="number"
                                                value={item.cost}
                                                placeholder="0"
                                                variant="outline"
                                                onChange={(e) =>
                                                    handleFieldChange(index, {
                                                        cost: e.target.value,
                                                    })
                                                }
                                                prefix={
                                                    <Text
                                                        pos="absolute"
                                                        top="28%"
                                                        left="5px"
                                                        fontSize="13px"
                                                        zIndex={10}
                                                    >
                                                        $
                                                    </Text>
                                                }
                                            />
                                        </Td>

                                        {/* Amount */}
                                        <Td w="15%" paddingInlineStart="1rem">
                                            <InputBlank
                                                value={Round(item.totalCost)}
                                                readonly={true}
                                                placeholder="0"
                                                variant="filled"
                                                prefix={
                                                    <Text
                                                        pos="absolute"
                                                        top="28%"
                                                        left="5px"
                                                        fontSize="13px"
                                                        zIndex={10}
                                                    >
                                                        $
                                                    </Text>
                                                }
                                            />
                                        </Td>
                                        <Td w="6%" p="0rem">
                                            <Icon
                                                as={BsTrash3Fill}
                                                mr=".5rem"
                                                color="#FF5B79"
                                                onClick={() =>
                                                    handleDeleteLineItem(index)
                                                }
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tables>
                        </Box>

                        {/* {showForm && (
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
schema={schema}
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
schema={schema}
                                    name="quantity"
                                    variant="outline"
                                    w="15%"
                                />
                                <PrimaryInput<TInvoiceItems>
                                    label="Cost"
                                    error={errors.cost}
                                    register={register}
schema={schema}
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
                        )} */}

                        <Box
                            pb="10px"
                            borderBottom="1px solid #dddddd"
                            w="full"
                            mt="23px"
                        >
                            <HStack
                                color="brand.400"
                                cursor="pointer"
                                // onClick={() => setShowForm((prev) => !prev)}
                                onClick={() => handleAddLineItem()}
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

                        <VStack align="flex-end" my="13px" mr="5%">
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
