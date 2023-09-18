import {
    Box,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
    VStack,
    Button,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import Checkbox from './Checkbox';
import { GrClose } from 'react-icons/gr';
import { MdCancel } from 'react-icons/md';
import { CgNotes } from 'react-icons/cg';
import Cookies from 'js-cookie';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';
import BeatLoader from 'react-spinners/BeatLoader';
import { UserContext } from '@components/context/UserContext';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: any;
    record: any;
    fileName: any;
    model: any;
    payPartner?: boolean;
    paygroupId?: number;
    id?: string;
}

export const ExportReportModal = ({
    isOpen,
    onClose,
    data,
    record,
    fileName,
    model,
    paygroupId,
    payPartner,
    id,
}: ExportProps) => {
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                data?.filter((x) => x !== 'Action' && x !== '').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            data
                ?.filter((x) => x !== 'Action' && x !== '')
                .forEach((x) =>
                    response.push(x as string),
                ) as unknown as string[];

            setSelectedId([...response]);
            return;
        }
        const existingValue = selectedId.find((e) => e === id);
        if (existingValue) {
            const newArray = selectedId.filter((x) => x !== id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, id]);
    };

    const [fromDate, setFromDate] = useState<any>();
    const [toDate, setToDate] = useState<any>();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const token = Cookies.get('token');
    const startDate = fromDate?.format('YYYY-MM-DD');
    const endDate = toDate?.format('YYYY-MM-DD');

    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;

    const header = selectedId.map((e) => `rowHeaders=${e}`).join('&');

    // const payrollGroupId = payPartner && `PayrollGroupId=${paygroupId}`;

    const exportData = async () => {
        if (startDate == undefined || endDate == undefined) {
            toast({
                title: 'Please select a date range',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        if (selectedId.length < 1) {
            toast({
                title: 'Please select a column title',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        const filename = `${fileName} Report for ${startDate} - ${endDate}`;
        const xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            setLoading(true);
            let a;
            if (
                xmlHttpRequest.readyState === 4 &&
                xmlHttpRequest.status === 200
            ) {
                a = document.createElement('a');
                a.href = window.URL.createObjectURL(xmlHttpRequest.response);
                a.download = filename;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setLoading(false);
            }
        };
        xmlHttpRequest.open(
            'GET',
            `${
                (process.env.NEXT_PUBLIC_API_BASEURL as string) ||
                'https://pi-commandcenterdev.azurewebsites.net'
            }/api/export/${model}?Record=${record}&${
                payPartner && `PayrollGroupId=${paygroupId}`
            }&${
                id && `EmployeeInformationId=${id}`
            }&${header}&StartDate=${startDate}&EndDate=${endDate}&superAdminId=${superAdminId}`,
        );
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
        xmlHttpRequest.setRequestHeader('Authorization', `Bearer ${token}`);
        xmlHttpRequest.responseType = 'blob';
        xmlHttpRequest.withCredentials = true;
        xmlHttpRequest.send(
            JSON.stringify({
                key: '8575',
                type: 'userdetails',
            }),
        );
    };

    const closeModal = () => {
        setSelectedId([]);
        setFromDate(undefined);
        setToDate(undefined);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '30%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="semibold"
                        >
                            Download Report
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        <VStack
                            align="flex-start"
                            spacing="1.5rem"
                            mb="1.5rem"
                            w="full"
                        >
                            <HStack spacing={['0', '.5rem']}>
                                <HStack>
                                    <Text
                                        mb="0"
                                        fontSize=".8rem"
                                        fontWeight="600"
                                        display={['none', 'block']}
                                    >
                                        From
                                    </Text>

                                    <Box
                                        marginInlineStart={[
                                            '0 !important',
                                            '.5rem !important',
                                        ]}
                                    >
                                        <DatePicker
                                            value={fromDate}
                                            onChange={setFromDate}
                                            format="MMM DD, YYYY"
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="fit-content"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                FaRegCalendarAlt
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                    </Box>
                                </HStack>
                                <HStack>
                                    <Text
                                        mb="0"
                                        fontSize=".8rem"
                                        fontWeight="600"
                                        display={['none', 'block']}
                                    >
                                        To
                                    </Text>
                                    <Text
                                        mb="0"
                                        fontSize=".8rem"
                                        fontWeight="600"
                                        display={['block', 'none']}
                                    >
                                        -
                                    </Text>

                                    <DatePicker
                                        value={toDate}
                                        onChange={setToDate}
                                        format="MMM DD, YYYY"
                                        render={(value, openCalendar) => {
                                            return (
                                                <HStack
                                                    w="fit-content"
                                                    px="1rem"
                                                    h="2.5rem"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    border="1px solid"
                                                    borderColor="gray.300"
                                                    color="gray.500"
                                                    boxShadow="sm"
                                                    borderRadius="0"
                                                    cursor="pointer"
                                                    fontSize=".9rem"
                                                    onClick={openCalendar}
                                                >
                                                    <Text
                                                        mb="0"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {value}
                                                    </Text>
                                                    <Icon
                                                        as={FaRegCalendarAlt}
                                                    />
                                                </HStack>
                                            );
                                        }}
                                    />
                                </HStack>
                            </HStack>
                            <Box
                                borderTop="1px solid"
                                borderBottom="1px solid"
                                borderColor="gray.300"
                                py=".8rem"
                                w="full"
                            >
                                <Checkbox
                                    checked={
                                        data?.filter(
                                            (x) => x !== 'Action' && x !== '',
                                        ).length == selectedId.length
                                    }
                                    onChange={() => toggleSelected('', true)}
                                    label="Select all"
                                    dir="rtl"
                                />
                            </Box>
                            {data
                                .filter((x) => x !== 'Action' && x !== '')
                                .map((x: any) => (
                                    <Checkbox
                                        checked={
                                            selectedId.find((e) => e === x) ||
                                            ''
                                        }
                                        onChange={() =>
                                            toggleSelected(x as string)
                                        }
                                        label={x}
                                        dir="rtl"
                                    />
                                ))}
                        </VStack>
                        <HStack
                            gap={['1rem', '2rem']}
                            spacing="0"
                            flexDir={['column', 'row']}
                            mb="1rem"
                        >
                            <Button
                                bgColor="#EF516D"
                                onClick={closeModal}
                                color="white"
                                w="full"
                            >
                                <Icon as={MdCancel} mr=".5rem" />
                                Cancel Report
                            </Button>
                            <Button
                                bgColor="brand.400"
                                onClick={exportData}
                                color="white"
                                w="full"
                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                            >
                                <Icon as={CgNotes} mr=".5rem" />
                                Export Report
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
