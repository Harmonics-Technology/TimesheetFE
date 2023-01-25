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
import { useRef } from 'react';
import { ExpenseView, InvoiceView, PayrollView } from 'src/services';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';
import RejectInvoiceModal from '@components/bits-utils/RejectInvoiceModal';
import RejectedMessage from '@components/bits-utils/RejectedMessage';

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
    const exchangeRate = clicked?.rate as unknown as number;
    const allInvoiceTotal = (
        clicked?.children as unknown as InvoiceView[]
    )?.reduce((a, b) => a + (b?.totalAmount as number), 0);
    // const allExpenseTotal = clicked?.children
    //     ?.map((x) => x.expenses?.reduce((a, b) => a + (b?.amount as number), 0))
    //     ?.reduce((a: any, b: any) => a + b, 0);
    const hst = 300;
    const hstNaira = hst * exchangeRate;
    const status = clicked?.status;
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
                            fontSize="1.1rem"
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
                                <Text>Pro Insight Technology</Text>
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
                                            {moment(clicked?.startDate).format(
                                                'DD/MM/YYYY',
                                            )}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Due Date:{' '}
                                            {moment(clicked?.endDate).format(
                                                'DD/MM/YYYY',
                                            )}
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
                                            Pro insight technology <br />
                                            201 New York Ibeju Leki, 201
                                            New-York Ibeju Leki
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
                                            'Rate',
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
                                                            name={moment(
                                                                x?.startDate,
                                                            ).format(
                                                                'DD/MM/YYYY',
                                                            )}
                                                        />
                                                        <TableData
                                                            name={moment(
                                                                x?.endDate,
                                                            ).format(
                                                                'DD/MM/YYYY',
                                                            )}
                                                        />
                                                        <TableData
                                                            name={`${Naira(
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
                                                            )} ${
                                                                x?.expenses
                                                                    ?.length !==
                                                                0
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
                                                                    ?.length !==
                                                                0
                                                                    ? 'green'
                                                                    : ''
                                                            }
                                                        />
                                                        <TableData
                                                            name={CAD(
                                                                (x?.totalAmount as number) /
                                                                    exchangeRate,
                                                            )}
                                                        />
                                                        <TableData
                                                            name={Naira(
                                                                exchangeRate,
                                                            )}
                                                        />
                                                    </Tr>
                                                </>
                                            ))}
                                        </>
                                    </Tables>
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
                                                allInvoiceTotal / exchangeRate,
                                            )}
                                        />
                                        <InvoiceTotalText
                                            label="Hst"
                                            value={hst}
                                            cur="$"
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
                                                    (allInvoiceTotal +
                                                        hstNaira) /
                                                        exchangeRate,
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
                                    {moment(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </Text> */}
                            </PDFExport>
                        </Box>
                        <HStack justify="center" mt="4rem">
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
