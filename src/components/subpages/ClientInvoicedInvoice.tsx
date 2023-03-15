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
import calculatePercentage from '@components/generics/functions/calculatePercentage';

function ClientInvoicedInvoice({
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

    const hstPrice = calculatePercentage(clicked?.totalAmount, clicked?.hst);

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
                                            {formatDate(clicked?.startDate)}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Due Date:{' '}
                                            {formatDate(clicked?.endDate)}
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
                                            {
                                                clicked?.createdByUser
                                                    ?.organizationName
                                            }
                                            <br />
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
                                            'Salary',
                                            'Service charge',
                                            'Total',
                                        ]}
                                    >
                                        <>
                                            {clicked?.clientInvoiceChildren?.map(
                                                (x, i) => (
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
                                                                name={CUR(
                                                                    Round(
                                                                        x?.clientTotalAmount as unknown as number,
                                                                    ),
                                                                )}
                                                            />
                                                            <TableData
                                                                name={CUR(
                                                                    Round(
                                                                        Number(
                                                                            x
                                                                                ?.employeeInformation
                                                                                ?.fixedAmount ==
                                                                                true
                                                                                ? x
                                                                                      ?.employeeInformation
                                                                                      ?.onBoradingFee
                                                                                : calculatePercentage(
                                                                                      x?.clientTotalAmount,
                                                                                      x
                                                                                          ?.employeeInformation
                                                                                          ?.onBoradingFee,
                                                                                  ),
                                                                        ),
                                                                    ),
                                                                )}
                                                            />
                                                            <TableData
                                                                name={CUR(
                                                                    Round(
                                                                        (x?.clientTotalAmount as unknown as number) +
                                                                            Number(
                                                                                x
                                                                                    ?.employeeInformation
                                                                                    ?.fixedAmount ==
                                                                                    true
                                                                                    ? x
                                                                                          ?.employeeInformation
                                                                                          ?.onBoradingFee
                                                                                    : calculatePercentage(
                                                                                          x?.clientTotalAmount,
                                                                                          x
                                                                                              ?.employeeInformation
                                                                                              ?.onBoradingFee,
                                                                                      ),
                                                                            ),
                                                                    ),
                                                                )}
                                                            />
                                                        </Tr>
                                                    </>
                                                ),
                                            )}
                                        </>
                                    </Tables>
                                </Box>
                                <Box w="30%">
                                    {/* <InputBlank
                                        defaultValue={
                                            exchangeRate as unknown as string
                                        }
                                        placeholder=""
                                        label="Exchange Rate"
                                        fontSize=".8rem"
                                    /> */}
                                </Box>
                                <Box w="fit-content" ml="auto">
                                    <Flex
                                        flexDirection="column"
                                        w="fit-content"
                                    >
                                        <InvoiceTotalText
                                            label="Subtotal"
                                            cur={''}
                                            value={CUR(
                                                Round(clicked?.totalAmount),
                                            )}
                                        />
                                        <InvoiceTotalText
                                            label="Hst"
                                            value={CUR(hstPrice)}
                                            cur=""
                                            hst={clicked?.hst}
                                        />
                                        <Box
                                            border="2px dashed"
                                            borderColor="gray.300"
                                            borderX="none"
                                            pt="1em"
                                        >
                                            <InvoiceTotalText
                                                cur={''}
                                                label="Total"
                                                value={CUR(
                                                    Round(
                                                        (clicked?.totalAmount as unknown as number) +
                                                            (hstPrice as unknown as number),
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
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default ClientInvoicedInvoice;
