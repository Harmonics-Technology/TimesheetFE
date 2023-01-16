import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Tr,
} from '@chakra-ui/react';
import InvoiceTotalText from '@components/bits-utils/InvoiceTotalText';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import { useRef } from 'react';
import { ExpenseView, InvoiceView, PayrollView } from 'src/services';
import Naira, { CAD } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';

function InvoiceTemplate({
    isOpen,
    onClose,
    clicked,
}: {
    isOpen: boolean;
    onClose: any;
    clicked: InvoiceView | undefined;
}) {
    const ref = useRef<any>(null);
    function downloadInvoice() {
        if (ref.current) {
            ref.current.save();
        }
    }
    console.log({ clicked });
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
                    w={['88%', '50%']}
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
                                            {`INV - ${clicked?.id?.slice(
                                                0,
                                                8,
                                            )}`}
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
                                            'Rate',
                                        ]}
                                    >
                                        <>
                                            <Tr key={clicked?.id}>
                                                <TableData
                                                    name={'Adedayo John'}
                                                />
                                                <TableData
                                                    name={moment(
                                                        clicked?.startDate,
                                                    ).format('DD/MM/YYYY')}
                                                />
                                                <TableData
                                                    name={moment(
                                                        clicked?.endDate,
                                                    ).format('DD/MM/YYYY')}
                                                />
                                                <TableData
                                                    name={Naira(
                                                        clicked?.totalAmount,
                                                    )}
                                                />
                                                <TableData
                                                    name={clicked?.rate}
                                                />
                                            </Tr>
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
                                            cur="$"
                                            value={Math.round(
                                                clicked?.totalAmount as number,
                                            )}
                                        />
                                        <InvoiceTotalText
                                            label="Hst"
                                            value={'0'}
                                            cur="$"
                                        />
                                        <Box
                                            border="2px dashed"
                                            borderColor="gray.300"
                                            borderX="none"
                                            pt="1em"
                                        >
                                            <InvoiceTotalText
                                                cur="$"
                                                label="Total"
                                                value={Math.round(
                                                    clicked?.totalAmount as number,
                                                )}
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                                <Text
                                    textAlign="center"
                                    fontSize=".7rem"
                                    my="2rem"
                                >
                                    Generated on{' '}
                                    {moment(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </Text>
                            </PDFExport>
                        </Box>
                        <Button
                            bgColor="brand.400"
                            color="white"
                            fontSize=".8rem"
                            onClick={downloadInvoice}
                        >
                            Download Invoice
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default InvoiceTemplate;
