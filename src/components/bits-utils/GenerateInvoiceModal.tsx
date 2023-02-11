import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Text,
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tr,
    Tbody,
    Grid,
    VStack,
    ModalCloseButton,
    Divider,
    useToast,
} from '@chakra-ui/react';
import {
    ExpenseView,
    FinancialService,
    InvoiceView,
    InvoiceViewStandardResponse,
    PaySlipView,
    PaymentPartnerInvoiceModel,
} from 'src/services';
import { TableData, TableHead } from './TableData';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PayslipInfoTag } from './PayslipInfoTag';
import numWords from 'num-words';
import Tables from './Tables';
import InvoiceTotalText from './InvoiceTotalText';
import Naira, { CUR } from '@components/generics/functions/Naira';
import { SelectrixBox } from './Selectrix';
import { PrimaryInput } from './PrimaryInput';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';

type Props = {
    isOpen?: any;
    onClose?: any;
    clicked: any;
    id: any;
};
const schema = yup.object().shape({
    rate: yup.string().required(),
});

export const GenerateInvoiceModal = ({
    isOpen,
    onClose,
    clicked,
    id,
}: Props) => {
    const toast = useToast();
    const router = useRouter();

    const {
        handleSubmit,
        register,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PaymentPartnerInvoiceModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            payrollGroupId: id,
        },
    });

    const exchangeRate = Number(watch('rate')) || 0;
    const invoicesId: string[] = clicked.map((x) => x.id);

    const allInvoiceTotal = clicked.reduce((a, b) => a + b.totalAmount, 0);
    // const allExpenseTotal = clicked?.children
    //     ?.map((x) => x.expenses?.reduce((a, b) => a + (b?.amount as number), 0))
    //     ?.reduce((a: any, b: any) => a + b, 0);
    const { hstAmount } = useContext(OnboardingFeeContext);
    function calculatePercentage(num, per) {
        return (num / 100) * per;
    }
    const hst =
        calculatePercentage(allInvoiceTotal, hstAmount?.fee) / exchangeRate;
    const hstNaira = hst * exchangeRate;
    const total = (allInvoiceTotal + hstNaira) / exchangeRate;
    console.log({ exchangeRate });

    const onSubmit = async (data: PaymentPartnerInvoiceModel) => {
        (data.invoiceIds = invoicesId), (data.totalAmount = total);
        console.log({ data });
        try {
            const result = await FinancialService.createPaymentPartnerInvoice(
                data,
            );
            if (result.status) {
                console.log({ result });
                toast({
                    title: `Successful`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(90deg)"
                />
                <ModalContent
                    py={5}
                    borderRadius="0"
                    w={['88%', '80%']}
                    maxW="unset"
                    overflow="hidden"
                    // maxH="100vh"
                    mt="0"
                    mb="0"
                >
                    <ModalHeader>
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="semibold"
                            px={5}
                        >
                            Create Invoice
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box overflowY="auto" px={5} maxH="80vh">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Box w="30%">
                                    {/* <SelectrixBox<PaymentPartnerInvoiceModel>
                                        control={control}
                                        name="cLientId"
                                        error={errors.cLientId}
                                        keys="id"
                                        keyLabel="label"
                                        label="Client"
                                        options={[
                                            {
                                                id: '08daf98a-c037-4cb6-86c9-aac6c6b64440',
                                                label: 'Pro Insight Technology',
                                            },
                                            {
                                                id: '08dae21c-327a-4d2f-83d9-19b49cfc1ba1',
                                                label: 'Olade',
                                            },
                                        ]}
                                    /> */}
                                </Box>
                                {/* <Text>Pro Insight Technology</Text> */}

                                <Box
                                    my="2rem"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    borderX="none"
                                >
                                    <Tables
                                        tableHead={[
                                            'Name',
                                            'Start Date',
                                            'End Date',
                                            'Amount (₦)',
                                            // 'Amount ($)',
                                        ]}
                                    >
                                        <>
                                            {clicked?.map((x: InvoiceView) => (
                                                <Tr key={x.id}>
                                                    <TableData name={x.name} />
                                                    <TableData
                                                        name={moment(
                                                            x.startDate,
                                                        ).format('DD/MM/YYYY')}
                                                    />
                                                    <TableData
                                                        name={moment(
                                                            x.endDate,
                                                        ).format('DD/MM/YYYY')}
                                                    />
                                                    <TableData
                                                        name={`${Naira(
                                                            (x?.totalAmount as number) -
                                                                (
                                                                    x?.expenses as unknown as ExpenseView[]
                                                                )?.reduce(
                                                                    (a, b) =>
                                                                        a +
                                                                        (b?.amount as number),
                                                                    0,
                                                                ),
                                                        )} ${
                                                            x?.expenses
                                                                ?.length !== 0
                                                                ? `+ ${Naira(
                                                                      x.expenses?.reduce(
                                                                          (
                                                                              a,
                                                                              b,
                                                                          ) =>
                                                                              a +
                                                                              (b?.amount as number),
                                                                          0,
                                                                      ),
                                                                  )}`
                                                                : ''
                                                        }`}
                                                        classes={
                                                            x?.expenses
                                                                ?.length !== 0
                                                                ? 'green'
                                                                : ''
                                                        }
                                                    />
                                                    {/* <TableData
                                                        name={
                                                            Number(
                                                                x.totalAmount,
                                                            ) / exchangeRate
                                                        }
                                                    /> */}
                                                </Tr>
                                            ))}
                                        </>
                                    </Tables>
                                </Box>
                                <Divider my="1rem" />
                                <Box w="30%">
                                    <PrimaryInput<PaymentPartnerInvoiceModel>
                                        register={register}
                                        name="rate"
                                        error={errors.rate}
                                        defaultValue="0"
                                        type="text"
                                        placeholder=""
                                        label="Exchange Rate"
                                        fontSize="1rem"
                                    />
                                </Box>
                                <Box w="fit-content" ml="auto">
                                    <Flex
                                        flexDirection="column"
                                        w="fit-content"
                                    >
                                        <InvoiceTotalText
                                            label="Subtotal"
                                            value={
                                                allInvoiceTotal / exchangeRate
                                            }
                                            cur={'$'}
                                        />
                                        <InvoiceTotalText
                                            label="Hst"
                                            value={hst}
                                            cur={'$'}
                                        />
                                        {/* <InvoiceTotalText
                                            label="Total (₦)"
                                            value={allInvoiceTotal + hst}
                                            cur={'₦'}
                                        /> */}
                                        <Box
                                            // border="2px dashed"
                                            borderColor="gray.300"
                                            borderX="none"
                                            // pt="1em"
                                        >
                                            <InvoiceTotalText
                                                label="Total ($)"
                                                value={CUR(total)}
                                                cur={'$'}
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                                {/* <Text
                                    textAlign="center"
                                    fontSize=".7rem"
                                    my="2rem"
                                >
                                    Generated on{' '}
                                    {moment(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </Text> */}
                                <Divider my="2rem" />
                                <Box ml="auto" w="30%">
                                    <Button
                                        bgColor="brand.400"
                                        color="white"
                                        fontSize=".8rem"
                                        w="100%"
                                        h="3rem"
                                        type="submit"
                                        isLoading={isSubmitting}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
