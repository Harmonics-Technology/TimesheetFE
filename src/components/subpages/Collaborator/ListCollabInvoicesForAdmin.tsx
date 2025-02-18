import { Box, HStack, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
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
    ProjectInvoiceViewPagedCollection,
    ProjectManagementService,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { Round } from '@components/generics/functions/Round';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { TableCard } from '@components/bits-utils/ProjectManagement/Generics/TableCard';
import { ShowPrompt } from '@components/bits-utils/ProjectManagement/Modals/ShowPrompt';
import { LeaveTab } from '@components/bits-utils/LeaveTab';

export const ListCollabInvoicesForAdmin = ({
    invoices,
    teamUrl,
}: {
    invoices: ProjectInvoiceViewPagedCollection;
    teamUrl?: string;
}) => {
    const tableHead = [
        'Invoice Number',
        'Invoice Date',
        'Due Date',
        'Recipient',
        'Amount',
        'Status',
        'Action',
    ];

    const router = useRouter();
    const { user, subType } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');

    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const showDelete = (value) => {
        setData(value);
        onOpen();
    };

    // const { subId, status, from, to } = router?.query;

    // const filterBox = (type, value) => {
    //     router.push({
    //         query: {
    //             ...router.query,
    //             [type]: value,
    //         },
    //     });
    // };

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

    // console.log({ invoices });

    return (
        <Box
            bgColor="white"
            // borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <LeaveTab
                tabValue={[
                    {
                        text: 'Team Members',
                        url: teamUrl,
                    },
                    {
                        text: 'Payment Partners',
                        url: `/financials/invoices-payment`,
                        upgrade: subType == 'basic',
                    },
                    {
                        text: 'Clients',
                        url: `/financials/invoices-client`,
                        upgrade: subType !== 'premium',
                    },
                    {
                        text: 'Collaborators',
                        url: `/financials/invoices-collaborator`,
                    },
                ]}
            />
            {/* <HStack justify="space-between" align="flex-start" my="1rem">
                <ManageBtn
                    onClick={() =>
                        router.push(`/${role}/invoices/create-invoice`)
                    }
                    btn="Create invoice"
                    bg="brand.400"
                    w="fit-content"
                    h="2rem"
                />
            </HStack> */}
            <Box bgColor="white" borderRadius="6px" p="1rem" mt="2rem">
                <HStack justify="space-between">
                    <Box w="full">
                        <FilterSearch
                            searchOptions="Search by: Invoice Number"
                            data={invoices}
                        />
                    </Box>
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
                                name={x?.recipient?.organizationName}
                                fontWeight="500"
                            />

                            <TableData
                                name={CAD(Round(x?.total))}
                                fontWeight="500"
                            />

                            <ProjectStatusAction
                                id={x?.id as string}
                                status={x?.status?.toLowerCase()}
                            />

                            <ProjectInvoiceAction
                                route={`/${role}/invoices/${x?.id}`}
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
