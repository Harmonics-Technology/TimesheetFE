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
    Tooltip,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import InvoiceTotalText from '@components/bits-utils/InvoiceTotalText';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import { useContext, useRef } from 'react';
import { ExpenseView, InvoiceView, PayrollView } from 'src/services';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';
import RejectInvoiceModal from '@components/bits-utils/RejectInvoiceModal';
import RejectedMessage from '@components/bits-utils/RejectedMessage';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import InputBlank from '@components/bits-utils/InputBlank';
import { formatDate } from '@components/generics/functions/formatDate';
import { Round } from '@components/generics/functions/Round';

function Paymentinvoices({
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
    // console.log({ clicked });
    const exchangeRate = clicked?.rate as unknown as number;
    const allInvoiceTotal = (
        clicked?.children as unknown as InvoiceView[]
    )?.reduce((a, b) => a + (b?.totalAmount as number), 0);
    // const allExpenseTotal = clicked?.children
    //     ?.map((x) => x.expenses?.reduce((a, b) => a + (b?.amount as number), 0))
    //     ?.reduce((a: any, b: any) => a + b, 0);
    // const { hstAmount } = useContext(OnboardingFeeContext);
    function calculatePercentage(num, per) {
        return (num / 100) * per;
    }
    const hst =
        calculatePercentage(allInvoiceTotal, clicked?.hst) / exchangeRate;
    const hstNaira = hst * exchangeRate;
    const status = clicked?.status;

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
                        <Box overflowY="auto" px={5} maxH="80vh">
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
                                                clicked?.createdByUser
                                                    ?.organizationAddress
                                            }
                                        </Text>
                                        {/* <Text fontSize=".9rem" fontWeight="600">
                                    Address
                                </Text> */}
                                    </Box>
                                </Flex>
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
                                            'Amount ($)',
                                            'Fee',
                                        ]}
                                    >
                                        <>
                                            {clicked?.children?.map((x, i) => (
                                                <>
                                                    <Tr key={i}>
                                                        <TableData
                                                            name={x?.name}
                                                        />
                                                        <TableData
                                                            name={formatDate(
                                                                x?.startDate,
                                                            )}
                                                        />
                                                        <TableData
                                                            name={formatDate(
                                                                x?.endDate,
                                                            )}
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
                                                                x?.expenses
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
                                                                x?.expenses
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
                                                        <TableData
                                                            name={`${
                                                                x
                                                                    ?.employeeInformation
                                                                    ?.onBoradingFee
                                                            }${
                                                                x
                                                                    .employeeInformation
                                                                    ?.fixedAmount ==
                                                                false
                                                                    ? '%'
                                                                    : ''
                                                            }`}
                                                        />
                                                    </Tr>
                                                </>
                                            ))}
                                        </>
                                    </Tables>
                                </Box>
                                <Box w={['full', '30%']}>
                                    <InputBlank
                                        defaultValue={
                                            exchangeRate as unknown as string
                                        }
                                        placeholder=""
                                        label="Exchange Rate"
                                        fontSize=".8rem"
                                    />
                                </Box>
                                <Box w={['full', 'fit-content']} ml="auto">
                                    <Flex
                                        flexDirection="column"
                                        w="fit-content"
                                    >
                                        <InvoiceTotalText
                                            label="Subtotal($)"
                                            cur={'$'}
                                            value={CUR(
                                                Round(
                                                    allInvoiceTotal /
                                                        exchangeRate,
                                                ),
                                            )}
                                        />
                                        <InvoiceTotalText
                                            label="Subtotal(₦)"
                                            cur={'₦'}
                                            value={CUR(Round(allInvoiceTotal))}
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
                            </PDFExport>
                        </Box>
                        <HStack justify="center" mt="4rem" flexWrap="wrap">
                            <Button
                                bgColor="brand.400"
                                color="white"
                                fontSize=".8rem"
                                onClick={downloadInvoice}
                                borderRadius="0"
                                // h="3rem"
                            >
                                Download Invoice
                            </Button>
                            <Tooltip label="Click to view message" hasArrow>
                                <Button
                                    bgColor={
                                        status == 'REJECTED'
                                            ? 'red.600'
                                            : status == 'PENDING'
                                            ? 'brand.700'
                                            : status == 'APPROVED'
                                            ? 'brand.600'
                                            : 'brand.400'
                                    }
                                    color="white"
                                    fontSize=".8rem"
                                    onClick={onOpen}
                                    borderRadius="0"
                                    textTransform="capitalize"
                                    // h="3rem"
                                >
                                    {status}
                                </Button>
                            </Tooltip>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <RejectedMessage
                isOpen={isOpened}
                onClose={onClosed}
                clicked={clicked}
            />
        </>
    );
}
export default Paymentinvoices;
