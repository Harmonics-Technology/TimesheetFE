import {
    Box,
    Button,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import InvoiceTotalText from '@components/bits-utils/InvoiceTotalText';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import {
    ExpenseView,
    FinancialService,
    InvoiceView,
    PayrollView,
} from 'src/services';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';
import RejectInvoiceModal from '@components/bits-utils/RejectInvoiceModal';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import InputBlank from '@components/bits-utils/InputBlank';
import { formatDate } from '@components/generics/functions/formatDate';
import calculatePercentage from '@components/generics/functions/calculatePercentage';
import { Round } from '@components/generics/functions/Round';

function PayrollInvoice({
    isOpen,
    onClose,
    clicked,
}: {
    isOpen: boolean;
    onClose: any;
    clicked: InvoiceView | undefined;
}) {
    const { isOpen: isOpened, onClose: onClosed, onOpen } = useDisclosure();
    const ref = useRef<any>(null);
    function downloadInvoice() {
        if (ref.current) {
            ref.current.save();
        }
    }
    const exchangeRate = clicked?.rate as unknown as number;
    const allInvoiceTotal = (
        clicked?.children as unknown as InvoiceView[]
    )?.reduce((a, b) => a + (b?.totalPay as number), 0);
    // const allExpenseTotal = clicked?.children
    //     ?.map((x) => x.expenses?.reduce((a, b) => a + (b?.amount as number), 0))
    //     ?.reduce((a: any, b: any) => a + b, 0);
    // const { hstAmount } = useContext(OnboardingFeeContext);

    const hst =
        calculatePercentage(allInvoiceTotal, clicked?.hst) / exchangeRate;
    const hstNaira = hst * exchangeRate;
    //
    //
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();
    const router = useRouter();

    const approveInvoiceItems = async () => {
        try {
            setLoading(true);
            const result = await FinancialService.treatSubmittedInvoice(
                clicked?.id,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error.body.message || error.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const paymentDate =
        moment(clicked?.dateCreated).day() == 5
            ? moment(clicked?.dateCreated).weekday(12)
            : moment(clicked?.dateCreated).weekday(5);
    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalContent
                    py={5}
                    borderRadius="0"
                    w={['88%', '60%']}
                    maxW="unset"
                    overflow="hidden"
                    // maxH="100vh"
                    mt="0"
                    mb="0"
                >
                    <ModalHeader>
                        <Text
                            color="black"
                            fontSize="1rem"
                            textAlign="left"
                            fontWeight="semibold"
                            px={5}
                        >
                            Viewing Invoice
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box maxH="70vh">
                            <PDFExport
                                ref={ref}
                                paperSize="A4"
                                scale={0.7}
                                margin={40}
                                fileName={`INV - ${clicked?.id?.slice(
                                    0,
                                    8,
                                )}.pdf`}
                                author="KendoReact Team"
                            >
                                {/* <Text>{clicked?.paymentPartnerName}</Text> */}
                                <Flex
                                    bgColor="brand.400"
                                    color="white"
                                    borderRadius="20px"
                                    justify="space-between"
                                    p="2rem 2rem"
                                >
                                    <Box>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Invoice Number:{' '}
                                            {clicked?.invoiceReference}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Issued Date:{' '}
                                            {formatDate(clicked?.dateCreated)}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Due Date: {formatDate(paymentDate)}
                                        </Text>
                                    </Box>
                                    <Box maxW="35%" textAlign="right">
                                        <Text
                                            fontSize=".9rem"
                                            fontWeight="600"
                                            mb=".4rem"
                                        >
                                            Billed To
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            {clicked?.payrollGroupName} <br />
                                            {
                                                clicked?.employeeInformation
                                                    ?.client
                                                    ?.organizationAddress
                                            }
                                        </Text>
                                        {/* <Text fontSize=".9rem" fontWeight="600">
                                    Address
                                </Text> */}
                                    </Box>
                                </Flex>
                                <Box overflowY="auto" px={5} maxH="50vh">
                                    <Box
                                        my="2rem"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        borderX="none"
                                    >
                                        <Tables
                                            tableHead={[
                                                'Name',
                                                'Pay Period',
                                                'Amount (₦)',
                                                'Amount ($)',
                                                // 'Fees',
                                                // 'Total',
                                            ]}
                                        >
                                            <>
                                                {clicked?.children?.map(
                                                    (x, i) => (
                                                        <>
                                                            <Tr key={i}>
                                                                <TableData
                                                                    name={
                                                                        x?.name
                                                                    }
                                                                />
                                                                <TableData
                                                                    name={`${formatDate(
                                                                        x?.startDate,
                                                                    )} - ${formatDate(
                                                                        x?.endDate,
                                                                    )}`}
                                                                />
                                                                <TableData
                                                                    name={`${Naira(
                                                                        Round(
                                                                            (x?.totalAmount as number) -
                                                                                (
                                                                                    x?.expenses as unknown as ExpenseView[]
                                                                                )?.reduce(
                                                                                    (
                                                                                        a,
                                                                                        b,
                                                                                    ) =>
                                                                                        a +
                                                                                        (b?.amount as number),
                                                                                    0,
                                                                                ),
                                                                        ),
                                                                    )} ${
                                                                        x
                                                                            ?.expenses
                                                                            ?.length !==
                                                                        0
                                                                            ? `+ ${Naira(
                                                                                  Round(
                                                                                      x.expenses?.reduce(
                                                                                          (
                                                                                              a,
                                                                                              b,
                                                                                          ) =>
                                                                                              a +
                                                                                              (b?.amount as number),
                                                                                          0,
                                                                                      ),
                                                                                  ),
                                                                              )}`
                                                                            : ''
                                                                    }`}
                                                                    classes={
                                                                        x
                                                                            ?.expenses
                                                                            ?.length !==
                                                                        0
                                                                            ? 'green'
                                                                            : ''
                                                                    }
                                                                />

                                                                <TableData
                                                                    name={CAD(
                                                                        Round(
                                                                            (x?.totalAmount as number) /
                                                                                exchangeRate,
                                                                        ),
                                                                    )}
                                                                />
                                                                {/* <TableData
                                                            name={CAD(
                                                                x
                                                                    .employeeInformation
                                                                    ?.fixedAmount ==
                                                                    false
                                                                    ? calculatePercentage(
                                                                          (x?.totalAmount as number) /
                                                                              exchangeRate,
                                                                          x
                                                                              ?.employeeInformation
                                                                              ?.onBoradingFee,
                                                                      )
                                                                    : x
                                                                          ?.employeeInformation
                                                                          ?.onBoradingFee,
                                                            )}
                                                        /> */}
                                                                {/* <TableData
                                                            name={
                                                                x
                                                                    .employeeInformation
                                                                    ?.fixedAmount ==
                                                                false
                                                                    ? calculatePercentage(
                                                                          (x?.totalAmount as number) /
                                                                              exchangeRate,
                                                                          x
                                                                              ?.employeeInformation
                                                                              ?.onBoradingFee,
                                                                      ) +
                                                                      (x?.totalAmount as number)
                                                                    : (x
                                                                          ?.employeeInformation
                                                                          ?.onBoradingFee as number) +
                                                                      (x?.totalAmount as number)
                                                            }
                                                        /> */}
                                                                {/* <TableData
                                                            name={
                                                                clicked?.totalPay
                                                            }
                                                        /> */}
                                                            </Tr>
                                                        </>
                                                    ),
                                                )}
                                            </>
                                        </Tables>
                                    </Box>
                                    <Box w="30%">
                                        <InputBlank
                                            defaultValue={
                                                exchangeRate as unknown as string
                                            }
                                            placeholder=""
                                            label="Exchange Rate"
                                            fontSize=".8rem"
                                        />
                                    </Box>
                                    <Box w="fit-content" ml="auto">
                                        <Flex
                                            flexDirection="column"
                                            w="fit-content"
                                        >
                                            <InvoiceTotalText
                                                label="Subtotal"
                                                cur={'$'}
                                                value={CUR(
                                                    Round(
                                                        allInvoiceTotal /
                                                            exchangeRate,
                                                    ),
                                                )}
                                            />
                                            <InvoiceTotalText
                                                label="Hst"
                                                value={CUR(Round(hst))}
                                                cur="$"
                                                hst={clicked?.hst}
                                            />
                                            <Box
                                                border="2px dashed"
                                                borderColor="gray.300"
                                                borderX="none"
                                                pt="1em"
                                            >
                                                <InvoiceTotalText
                                                    cur={'$'}
                                                    label="Total"
                                                    value={CUR(
                                                        Round(
                                                            (allInvoiceTotal +
                                                                hstNaira) /
                                                                exchangeRate,
                                                        ),
                                                    )}
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
                                    {formatDate(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </Text> */}
                                </Box>
                            </PDFExport>
                        </Box>
                        <HStack justify="center" mt="4rem">
                            <Button
                                bgColor="brand.600"
                                color="white"
                                fontSize=".8rem"
                                onClick={downloadInvoice}
                                borderRadius="0"
                                // h="3rem"
                            >
                                Download Invoice
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                fontSize=".8rem"
                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                                onClick={approveInvoiceItems}
                                disabled={clicked?.status !== 'PENDING'}
                                borderRadius="0"
                                // h="3rem"
                            >
                                Approve This Invoice
                            </Button>
                            <Button
                                bgColor="red.600"
                                color="white"
                                fontSize=".8rem"
                                onClick={onOpen}
                                borderRadius="0"
                                disabled={clicked?.status !== 'PENDING'}
                                // h="3rem"
                            >
                                Reject This Invoice
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <RejectInvoiceModal
                isOpen={isOpened}
                onClose={onClosed}
                clicked={clicked}
                closeAll={onClose}
            />
        </>
    );
}
export default PayrollInvoice;
