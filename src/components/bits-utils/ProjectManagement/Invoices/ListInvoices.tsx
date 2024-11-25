import {
    Box,
    Button,
    HStack,
    Icon,
    Select,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    ProjectInvoiceAction,
    ProjectStatusAction,
} from '@components/bits-utils/TableData';
import { CAD } from '@components/generics/functions/Naira';
import moment from 'moment';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import {
    ProjectInvoiceRecipientView,
    ProjectInvoiceViewPagedCollection,
    ProjectManagementService,
} from 'src/services';
import { TopBar } from '../Projects/SingleProject/TopBar';
import { TableCard } from '../Generics/TableCard';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { CustomDatePick } from '@components/bits-utils/CustomDatePick';
import Pagination from '@components/bits-utils/Pagination';
import { ShowPrompt } from '../Modals/ShowPrompt';

export const ListInvoices = ({
    id,
    invoices,
    recipients,
}: {
    id: string;
    invoices: ProjectInvoiceViewPagedCollection;
    recipients: ProjectInvoiceRecipientView[];
}) => {
    const tableHead = [
        'Invoice Number',
        'Invoice Date',
        'Due Date',
        'Recipient',
        'Amount Due',
        'Status',
        'Action',
    ];

    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const showDelete = (value) => {
        setData(value);
        onOpen();
    };

    const { subId, status, from, to } = router?.query;

    const filterBox = (type, value) => {
        router.push({
            query: {
                ...router.query,
                [type]: value,
            },
        });
    };

    const deleteInvoice = async () => {
        setLoading(true);
        try {
            const res = await ProjectManagementService.deleteInvoice(data?.id);
            if (res?.status) {
                router.replace(router?.asPath);
                onClose();
            }
        } catch (err: any) {
            toast({
                title: err?.body?.message || err.message,
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
            >
                <Button bgColor="#f0f0f0" h="1.5rem" w="1.5rem" minW="0">
                    <Icon as={MdOutlineArrowBackIosNew} fontSize=".8rem" />
                </Button>
                <Text color="brand.400" fontWeight={500}>
                    Back
                </Text>
            </HStack>
            <HStack justify="space-between" align="flex-start" my="1rem">
                <Text fontWeight={600}>All Invoices</Text>
                <ManageBtn
                    onClick={() =>
                        router.push(
                            `/${role}/project-management/projects/${id}/invoices/create-invoice`,
                        )
                    }
                    btn="Create invoice"
                    bg="brand.400"
                    w="fit-content"
                    h="2rem"
                />
            </HStack>
            <Box bgColor="white" borderRadius="6px" p="1rem" mt="2rem">
                <HStack justify="space-between">
                    <Select
                        fontSize=".8rem"
                        w="full"
                        onChange={(e) => filterBox('subId', e?.target.value)}
                        value={subId}
                    >
                        <option value="">All Recipient</option>
                        {recipients?.map((x) => (
                            <option value={x?.organizationName as string}>
                                {x?.organizationName}
                            </option>
                        ))}
                    </Select>
                    <Select
                        fontSize=".8rem"
                        w="full"
                        onChange={(e) => filterBox('status', e?.target.value)}
                        value={status}
                    >
                        <option value="">Status</option>
                        <option value="1">Paid</option>
                        <option value="2">Draft</option>
                        <option value="3">Sent</option>
                        <option value="4">Overdue</option>
                    </Select>
                    <CustomDatePick
                        setDate={(e) =>
                            filterBox('from', moment(e).format('YYYY-MM-DD'))
                        }
                        format="DD/MM/YYYY"
                        date={new Date(from as any)}
                        w="full"
                    />
                    <CustomDatePick
                        setDate={(e) =>
                            filterBox('to', moment(e).format('YYYY-MM-DD'))
                        }
                        format="DD/MM/YYYY"
                        date={new Date(to as any)}
                        w="full"
                    />
                    <SubSearchComponent w="full" />
                </HStack>
                <TableCard tableHead={tableHead} overflow="unset">
                    {invoices?.value?.map((x) => (
                        <TableRow key={x.invoiceReference}>
                            <TableData
                                name={x?.invoiceReference}
                                fontWeight="500"
                            />

                            <TableData
                                name={moment(x?.issuedDate).format(
                                    'DD/MM/YYYY',
                                )}
                                fontWeight="500"
                            />
                            <TableData
                                name={moment(x?.dueDate).format('DD/MM/YYYY')}
                                fontWeight="500"
                            />
                            <TableData
                                name={x?.organization}
                                fontWeight="500"
                            />

                            <TableData name={CAD(x?.total)} fontWeight="500" />

                            <ProjectStatusAction
                                id={x?.id as string}
                                status={x?.status?.toLowerCase()}
                            />

                            <ProjectInvoiceAction
                                route={`/${role}/project-management/projects/${id}/invoices/${x?.id}`}
                                showDelete={showDelete}
                                data={x}
                            />
                        </TableRow>
                    ))}
                </TableCard>
                <Pagination data={invoices} />
                {isOpen && (
                    <ShowPrompt
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={deleteInvoice}
                        loading={loading}
                        text={`Are you sure you want to delete this invoice? <br/> This action cannot be undone`}
                    />
                )}
            </Box>
        </Box>
    );
};
