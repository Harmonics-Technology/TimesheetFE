import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    Box,
    HStack,
    Flex,
    Image,
    Tr,
    Td,
    Table,
    Thead,
    Th,
    Button,
    Circle,
} from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import moment from 'moment';
import { LiaTimesSolid } from 'react-icons/lia';
import Tables from '../Tables';
import { TableData } from '../TableData';
import { useContext, useRef } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import shadeColor from '@components/generics/functions/shadeColor';
import { AiOutlineClose } from 'react-icons/ai';
import { UserContext } from '@components/context/UserContext';

type Props = {
    isOpen?: any;
    onClose?: any;
    data: any;
};

export const SubDescription = ({
    label,
    value,
    fw = 500,
}: {
    label: string;
    value: any;
    fw?: any;
}) => {
    return (
        <HStack
            borderTop="1px solid #e6e6e6"
            justify="space-between"
            py=".3rem"
        >
            <Text fontSize=".9rem" fontWeight={fw}>
                {label}
            </Text>
            <Text fontSize=".9rem">{value}</Text>
        </HStack>
    );
};

export const SubscriptionInvoice = ({ isOpen, onClose, data }: Props) => {
    const tableHead = ['Description', 'Qty', 'Unit price', `Amount`];

    const ref = useRef<any>(null);
    function downloadInvoice() {
        if (ref.current) {
            ref.current.save();
        }
    }

    const amount = data.amountInCent / 100;

    const { user } = useContext(UserContext);

    // console.log({ data });

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                // motionPreset="slideInBottom"
                isCentered
                // closeOnOverlayClick={true}
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) "
                />

                <ModalContent maxW="100%" h="100vh" bgColor="transparent">
                    <Box
                        w={['88%', '60%']}
                        py={0}
                        borderRadius="0px"
                        overflow="hidden"
                        maxH="100vh"
                        pos="fixed"
                        // mt="1rem"
                        mb="1rem"
                        mx="auto"
                        left="50%"
                        top="50%"
                        transform="translate(-50%,-50%)"
                    >
                        <ModalHeader textAlign="center">
                            <HStack justify="center">
                                <Button
                                    bgColor="brand.400"
                                    color="white"
                                    fontSize=".8rem"
                                    onClick={downloadInvoice}
                                    colorScheme="brand"
                                    // _hover={{
                                    //     bgColor: shadeColor('#2eafa3', 0.8),
                                    // }}
                                >
                                    Download Invoice
                                </Button>
                                <Circle onClick={onClose} cursor="pointer">
                                    <AiOutlineClose />
                                </Circle>
                            </HStack>
                        </ModalHeader>

                        <ModalBody>
                            <Box
                                maxH="80vh"
                                h="80vh"
                                overflowY="auto"
                                p={8}
                                fontFamily="Arial"
                                bgColor="white"
                            >
                                <PDFExport
                                    ref={ref}
                                    paperSize="A4"
                                    scale={0.7}
                                    margin={40}
                                    fileName={`${data.invoiceReference}.pdf`}
                                    author="KendoReact Team"
                                >
                                    <HStack
                                        w="full"
                                        justify="space-between"
                                        align="flex-start"
                                    >
                                        <Box w="max-content">
                                            <Text
                                                fontSize="1.5rem"
                                                color="#333333"
                                                fontWeight={600}
                                            >
                                                Invoice
                                            </Text>
                                            <Text
                                                fontSize=".9rem"
                                                color="#333333"
                                                fontWeight={600}
                                            >
                                                Invoice number{' '}
                                                {
                                                    data?.invoiceReference?.split(
                                                        'INV',
                                                    )[1]
                                                }
                                            </Text>
                                            <Box w="full" mt=".8rem">
                                                <HStack
                                                    gap="2rem"
                                                    w="full"
                                                    justify="space-between"
                                                >
                                                    <Text
                                                        fontSize=".9rem"
                                                        color="#333333"
                                                        fontWeight={500}
                                                    >
                                                        Date of issue
                                                    </Text>
                                                    <Text
                                                        fontSize=".9rem"
                                                        color="#333333"
                                                        fontWeight={500}
                                                    >
                                                        {moment(
                                                            data.startDate,
                                                        ).format(
                                                            'MMMM DD, YYYY',
                                                        )}
                                                    </Text>
                                                </HStack>
                                                <HStack
                                                    gap="2rem"
                                                    w="full"
                                                    justify="space-between"
                                                >
                                                    <Text
                                                        fontSize=".9rem"
                                                        color="#333333"
                                                        fontWeight={500}
                                                    >
                                                        Date due
                                                    </Text>
                                                    <Text
                                                        fontSize=".9rem"
                                                        color="#333333"
                                                        fontWeight={500}
                                                    >
                                                        {moment(
                                                            data.endDate,
                                                        ).format(
                                                            'MMMM DD, YYYY',
                                                        )}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                            <Box w="full" mt="1rem">
                                                <Text
                                                    fontSize=".9rem"
                                                    color="#333333"
                                                    fontWeight={600}
                                                >
                                                    Bill to
                                                </Text>
                                                <Text
                                                    fontSize=".9rem"
                                                    color="#333333"
                                                    fontWeight={500}
                                                >
                                                    {data?.billingAccount}
                                                </Text>
                                                <Text
                                                    fontSize=".9rem"
                                                    color="#333333"
                                                    fontWeight={500}
                                                >
                                                    {user?.email}
                                                </Text>
                                            </Box>
                                        </Box>
                                        <Box textAlign="right">
                                            <Text
                                                fontSize="1.5rem"
                                                color="#333333"
                                                opacity={0.5}
                                                fontWeight={600}
                                            >
                                                Pro-Insight Consulting Inc.
                                            </Text>
                                            <Text
                                                fontSize=".9rem"
                                                color="#333333"
                                                fontWeight={500}
                                            >
                                                25 Sheppard Avenue West, Suite
                                                300,
                                            </Text>
                                            <Text
                                                fontSize=".9rem"
                                                color="#333333"
                                                fontWeight={500}
                                            >
                                                Toronto ON. M2N 6S6
                                            </Text>
                                            <Text
                                                fontSize=".9rem"
                                                color="#333333"
                                                fontWeight={500}
                                            >
                                                Web: www.proinsight.ca
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <Box my="2.5rem">
                                        <Text
                                            fontSize="1.3rem"
                                            color="#333333"
                                            fontWeight={600}
                                        >
                                            {data?.paymentStatus == 'paid'
                                                ? `C${CAD(amount)} Paid`
                                                : `C${CAD(amount)} due{' '}
                                            ${moment(data?.startDate).format(
                                                'MMMM DD, YYYY',
                                            )}`}
                                        </Text>
                                    </Box>
                                    <Table>
                                        <Thead>
                                            <Tr w="full">
                                                {tableHead.map((x, i) => (
                                                    <Th
                                                        px="0rem"
                                                        py=".3rem"
                                                        fontSize="12px"
                                                        fontWeight="600"
                                                        textTransform="capitalize"
                                                        fontFamily="Arial"
                                                        key={i}
                                                        borderBottom="2px solid #333333"
                                                    >
                                                        {x}
                                                    </Th>
                                                ))}
                                            </Tr>
                                        </Thead>
                                        <Tr>
                                            <Td
                                                w="80%"
                                                px="0"
                                                fontSize=".9rem"
                                                fontWeight={500}
                                                border={0}
                                                py=".3rem"
                                            >
                                                <Box>
                                                    <Text>
                                                        {data?.licenceType}
                                                    </Text>
                                                    <Text>{`${moment(
                                                        data?.startDate,
                                                    ).format(
                                                        'MMM DD',
                                                    )} - ${moment(
                                                        data?.endDate,
                                                    ).format(
                                                        'MMM DD, YYYY',
                                                    )}`}</Text>
                                                </Box>
                                            </Td>
                                            <Td
                                                px="0"
                                                fontSize=".9rem"
                                                fontWeight={500}
                                                border={0}
                                                py=".3rem"
                                            >
                                                1
                                            </Td>
                                            <Td
                                                px="0"
                                                fontSize=".9rem"
                                                fontWeight={500}
                                                border={0}
                                                py=".3rem"
                                            >
                                                C{CAD(80)}
                                            </Td>
                                            <Td
                                                w="fit-content"
                                                px="0"
                                                fontSize=".9rem"
                                                fontWeight={500}
                                                border={0}
                                                py=".3rem"
                                            >
                                                C{CAD(amount)}
                                            </Td>
                                        </Tr>
                                    </Table>
                                    <Box w="50%" ml="auto" mt="1rem">
                                        <SubDescription
                                            label="Subtotal"
                                            value={`C${CAD(amount)}`}
                                        />
                                        <SubDescription
                                            label="Total"
                                            value={`C${CAD(amount)}`}
                                        />
                                        <SubDescription
                                            label="Amount due"
                                            value={`C${CAD(
                                                data?.paymentStatus == 'paid'
                                                    ? 0
                                                    : amount,
                                            )}`}
                                            fw={600}
                                        />
                                    </Box>
                                </PDFExport>
                            </Box>
                        </ModalBody>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};
