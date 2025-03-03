import {
    Box,
    Button,
    Grid,
    HStack,
    Icon,
    Text,
    Tr,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TopBar } from '../Projects/SingleProject/TopBar';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { RiPencilFill } from 'react-icons/ri';
import { UserContext } from '@components/context/UserContext';
import Tables from '@components/bits-utils/Tables';
import { TableData } from '@components/bits-utils/TableData';
import { SummaryBox } from './CreateInvoice';
import { Round } from '@components/generics/functions/Round';
import calculatePercentage from '@components/generics/functions/calculatePercentage';
import { ProjectInvoiceView, ProjectManagementService } from 'src/services';
import { formatDate } from '@components/generics/functions/formatDate';
import { CAD, CUR } from '@components/generics/functions/Naira';
import { UploadClient } from '@uploadcare/upload-client';

export const SingleItem = ({ label, value }) => {
    return (
        <HStack gap="1rem" justify="flex-end">
            <Text
                fontSize="13px"
                fontWeight={500}
                lineHeight="19px"
                textAlign="right"
                w="65%"
            >
                {label}:
            </Text>
            <Text
                fontSize="13px"
                fontWeight={500}
                lineHeight="19px"
                w="35%"
                // textAlign="right"
            >
                {value}
            </Text>
        </HStack>
    );
};

export const ProjectInvoice = ({
    id,
    invoice,
}: {
    id: string;
    invoice: ProjectInvoiceView;
}) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const hstValue = Round(
        calculatePercentage(invoice?.subtotal, Number(invoice?.hst)),
    );
    const invoiceRef = useRef<any>();
    const [loading, setLoading] = useState('');
    const toast = useToast();

    const updateStatus = async () => {
        setLoading('send');
        try {
            const res = await ProjectManagementService.updateInvoiceStatus({
                invoiceId: invoice.id,
                status: 3,
            });
            if (res.status) {
                router.replace(router.asPath);
                toast({
                    title: 'Your invoice has been successfully sent!',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } catch (error: any) {
            toast({
                title:
                    error?.message ||
                    error?.body?.message ||
                    'Invoice failed to send. Please retry',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoading('');
        }
    };

    // console.log({ invoice });

    const opt = {
        filename: `${invoice?.invoiceReference}.pdf`,
        image: { type: 'webp', quality: 0.95 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    const uploadDocument = async (url: string, name: string) => {
        try {
            await ProjectManagementService.addInvoiceAttachment({
                attachmentUrl: url,
                invoiceId: invoice?.id,
            });
        } catch (err: any) {
            console.log({ err });
        }
    };

    const client = new UploadClient({
        publicKey: 'fda3a71102659f95625f',
    });

    const generatePDF = async (content: any, name: string) => {
        if (typeof window !== 'undefined') {
            const html2pdf = require('html2pdf.js');
            await html2pdf().set(opt).from(content).toPdf().save();
            return true;
        }
    };
    const generatePDFForApi = async (content: any, name: string) => {
        if (typeof window !== 'undefined') {
            const html2pdf = require('html2pdf.js');
            await html2pdf()
                .set(opt)
                .from(content)
                .toPdf()
                .output('blob')
                .then((pdf: any) => {
                    client
                        .uploadFile(pdf)
                        .then((file: any) => {
                            uploadDocument(file?.cdnUrl, name);
                        })
                        .catch((error: any) => {
                            console.error('Error uploading file:', error);
                        });
                });
            return true;
        }
    };

    const DownloadInvoice = async () => {
        setLoading('invoice');
        const result = await generatePDF(
            invoiceRef.current,
            invoice?.invoiceReference as string,
        );
        if (result) {
            setLoading('');
            return;
        }
        setLoading('');
    };

    useEffect(() => {
        const uploadInvoice = async () => {
            await generatePDFForApi(
                invoiceRef.current,
                invoice?.invoiceReference as string,
            );
        };
        if (invoice?.attachmentUrl == null) {
            uploadInvoice();
        }
    }, []);

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
                    <Text fontWeight={600}>View Invoice</Text>
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
                            Invoice Summary
                        </Text>
                    </Box>
                    <Box borderRadius="5px" bgColor="white" p="14px" mb="1rem">
                        <HStack
                            color="brand.400"
                            cursor="pointer"
                            onClick={() =>
                                router.push(
                                    `/${role}/project-management/projects/${id}/invoices/edit/${invoice?.id}`,
                                )
                            }
                        >
                            <Icon as={RiPencilFill} />
                            <Text fontSize="13px">Edit Invoice</Text>
                        </HStack>
                        <Box bgColor="white" p="14px" ref={invoiceRef}>
                            <HStack
                                align="flex-end"
                                justify="space-between"
                                w="full"
                            >
                                <Box>
                                    <Text fontSize="12px" color="#808080">
                                        Project Name
                                    </Text>
                                    <Text fontWeight="600" color="#2D3748">
                                        {invoice?.projectName}
                                    </Text>
                                </Box>
                                <Box textAlign="right">
                                    <Text fontWeight="600" color="#2D3748">
                                        {user?.organizationName}
                                    </Text>
                                    <Text fontSize="12px" color="#808080">
                                        {user?.organizationAddress}
                                    </Text>
                                    <Text fontSize="12px" color="#808080">
                                        {user?.email}
                                    </Text>
                                    <Text fontSize="12px" color="#808080">
                                        {user?.organizationPhone}
                                    </Text>
                                </Box>
                            </HStack>
                            <HStack
                                justify="space-between"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="5px"
                                p="10px 19px 20px"
                                mt="15px"
                            >
                                <Box w="35%">
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        lineHeight="19px"
                                    >
                                        Bill To
                                    </Text>
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        lineHeight="19px"
                                    >
                                        {invoice?.recipient?.organizationName}
                                    </Text>
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        lineHeight="19px"
                                    >
                                        {invoice?.recipient?.address}
                                    </Text>
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        lineHeight="19px"
                                    >
                                        {invoice?.recipient?.email}
                                    </Text>
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        lineHeight="19px"
                                    >
                                        {invoice?.recipient?.phone}
                                    </Text>
                                </Box>
                                <Box w="35%">
                                    <SingleItem
                                        label="Invoice Number"
                                        value={invoice?.invoiceReference}
                                    />
                                    {invoice?.posNumber && (
                                        <SingleItem
                                            label="P.O/S.O Number"
                                            value={invoice?.posNumber}
                                        />
                                    )}
                                    <SingleItem
                                        label="Invoice Date"
                                        value={formatDate(invoice?.issuedDate)}
                                    />
                                    <SingleItem
                                        label="Payment Due"
                                        value={formatDate(invoice?.dueDate)}
                                    />
                                    <SingleItem
                                        label="Amount Due (CAD)"
                                        value={CUR(invoice?.total as number)}
                                    />
                                </Box>
                            </HStack>
                            <Box mt="5px">
                                <Tables
                                    tableHead={[
                                        'Items',
                                        'Qty',
                                        'Cost',
                                        `Amount`,
                                    ]}
                                    bg="#E8F2F1"
                                    variant="unset"
                                >
                                    {(invoice?.projectInvoiceItems || [])?.map(
                                        (x) => (
                                            <Tr key={x?.projectTaskId}>
                                                <TableData
                                                    name={x.projectTaskName}
                                                    full
                                                    breakWord
                                                />
                                                <TableData name={x?.quantity} />
                                                <TableData name={x?.cost} />
                                                <TableData
                                                    name={CAD(
                                                        Round(x?.totalCost),
                                                    )}
                                                    w="120px"
                                                />
                                            </Tr>
                                        ),
                                    )}
                                </Tables>
                                <VStack align="flex-end" my="13px" mr="-1.2%">
                                    <SummaryBox
                                        label="Subtotal"
                                        cur={'$'}
                                        value={invoice?.subtotal as number}
                                    />
                                    <SummaryBox
                                        label={`HST ${invoice?.hst}%`}
                                        cur={'$'}
                                        value={hstValue}
                                    />
                                    <Box borderY="2px solid #C2CFE0" py="4px">
                                        <SummaryBox
                                            label={'Total'}
                                            cur={'$'}
                                            value={invoice?.total as number}
                                        />
                                    </Box>
                                    <SummaryBox
                                        label="Amount Due"
                                        cur={'$'}
                                        value={invoice?.total as number}
                                    />
                                </VStack>
                            </Box>
                            {invoice?.notes && (
                                <Box my="17px" w="70%">
                                    <Text
                                        color="#2D3748"
                                        fontSize="14px"
                                        fontWeight={500}
                                        mb="8px"
                                    >
                                        Notes/Terms
                                    </Text>
                                    <Text color="#2D3748" fontSize="13px">
                                        {invoice?.notes}
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Box>
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
                    <Box mt="23px">
                        <Text color="#2D3748" fontSize="13px">
                            Creating an invoice involves detailing a transaction
                            between a seller and a buyer, specifying the
                            products or services provided, along with the
                            agreed-upon pricing, payment terms, and other
                            relevant information.
                        </Text>
                        <Grid
                            mt="19px"
                            gap="10px"
                            templateColumns="repeat(3, 1fr)"
                        >
                            <ManageBtn
                                bg="brand.400"
                                btn="Send Invoice"
                                h="40px"
                                w="full"
                                isLoading={loading == 'send'}
                                onClick={updateStatus}
                            />
                            <ManageBtn
                                bg="brand.400"
                                btn="Save to draft"
                                h="40px"
                                w="full"
                                // isLoading={loading}
                                onClick={() =>
                                    router.push(
                                        `/${role}/project-management/projects/${id}/invoices`,
                                    )
                                }
                            />
                            <ManageBtn
                                bg="white"
                                btn="Download as PDF"
                                h="40px"
                                w="full"
                                border="1px solid #2EAFA3"
                                color="brand.400"
                                isLoading={loading === 'invoice'}
                                onClick={DownloadInvoice}
                            />
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
