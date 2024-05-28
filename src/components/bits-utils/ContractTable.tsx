/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Spinner,
    FormLabel,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableContract,
    TableContractOptions,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useRef, useState } from 'react';
import { Widget } from '@uploadcare/react-widget';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import moment from 'moment';

interface adminProps {
    userProfile?: UserView;
    isSuperAdmin?: boolean;
}

import {
    ContractModel,
    ContractService,
    ContractView,
    ControlSettingView,
    UserView,
} from 'src/services';
import { useRouter } from 'next/router';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { DateObject } from 'react-multi-date-picker';
import ExtendContract from './ExtendContract';
import ModifyContract from './ModifyContract';
import ConfirmModal from './ConfirmModal';
import FilterSearch from './FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';
import { formatDate } from '@components/generics/functions/formatDate';
import { UserContext } from '@components/context/UserContext';
import { FaEllipsisH } from 'react-icons/fa';
import { getFileName } from '@components/generics/functions/getCurrencyName';

const schema = yup.object().shape({
    title: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
});

function ContractTable({ userProfile, isSuperAdmin }: adminProps) {
    const [contract, setContractFile] = useState<any>('');
    const [modify, setModify] = useState<boolean>(false);
    const [extend, setExtend] = useState<boolean>(false);
    const [clickedItem, setClickedItem] = useState<ContractView>({});
    const { accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;
    //
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContractModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            userId: userProfile?.id,
            startDate: clickedItem.startDate,
            endDate: clickedItem.endDate,
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: opens, onOpen: opened, onClose: closed } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    const [showLoading, setShowLoading] = useState(false);
    const widgetApi = useRef<any>();

    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                setShowLoading(true);
            });
            file.done((info) => {
                setShowLoading(false), setContractFile(info);
            });
        }
    };

    const onSubmit = async (data: ContractModel) => {
        data.document = `${contract.cdnUrl} ${contract.name}`;
        if (data.document === undefined || '') {
            toast({
                title: 'Please select a contract document and try again',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        try {
            const result = await ContractService.createContract(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                // padding="1.5rem"
                // boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    my="1rem"
                    py="1rem"
                    borderY="1px solid"
                    borderColor="gray.300"
                >
                    <Text
                        textTransform="uppercase"
                        mb="0"
                        fontSize="1.3rem"
                        fontWeight="500"
                    >
                        Contract Data
                    </Text>
                    {/* <Button
                        bgColor="brand.400"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpen}
                    >
                        +Contract
                    </Button> */}
                </Flex>
                {/* <FilterSearch /> */}
                <Tables
                    tableHead={[
                        'Job Title',
                        'Employment Type',
                        'Start Date',
                        'End Date',
                        'Duration',
                        'Contract',
                        // 'Status',
                        'Action',
                    ]}
                >
                    <>
                        {userProfile?.employeeInformation?.contracts?.map(
                            (x: ContractView) => (
                                <Tr key={x.title}>
                                    <TableData
                                        name={
                                            userProfile?.employeeInformation
                                                ?.jobTitle
                                        }
                                    />
                                    <TableData
                                        name={
                                            userProfile?.employeeInformation
                                                ?.employmentContractType
                                        }
                                    />
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableData
                                        name={x.tenor as unknown as string}
                                    />
                                    <TableContract
                                        url={
                                            x.document ||
                                            userProfile?.employeeInformation
                                                ?.inCorporationDocumentUrl
                                        }
                                        label={getFileName(
                                            x.document ||
                                                userProfile?.employeeInformation
                                                    ?.inCorporationDocumentUrl,
                                        )}
                                    />
                                    {/* <TableState name={x.status as string} /> */}
                                    {userAccess?.adminContractManagement ||
                                    isSuperAdmin ? (
                                        <TableContractOptions
                                            id={opened}
                                            modify={setModify}
                                            extend={setExtend}
                                            clicked={setClickedItem}
                                            data={x}
                                        />
                                    ) : (
                                        <td>
                                            <FaEllipsisH />
                                        </td>
                                    )}
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add new Contract'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box w="full">
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<ContractModel>
                                label="Contract Title"
                                name="title"
                                error={errors.title}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryDate<ContractModel>
                                control={control}
                                name="startDate"
                                label="Start Date"
                                error={errors.startDate}
                                min={new Date()}
                            />
                            <PrimaryDate<ContractModel>
                                control={control}
                                name="endDate"
                                label="End Date"
                                error={errors.endDate}
                                min={new DateObject().add(3, 'days')}
                            />
                            <Box>
                                <FormLabel
                                    textTransform="capitalize"
                                    width="fit-content"
                                    fontSize=".8rem"
                                >
                                    Attach Document
                                </FormLabel>

                                <Flex
                                    outline="1px solid"
                                    outlineColor="gray.300"
                                    h="2.6rem"
                                    align="center"
                                    pr="1rem"
                                    w={['100%', '100%']}
                                    // justifyContent="space-between"
                                >
                                    <Flex
                                        bgColor="#f5f5f5"
                                        fontSize=".8rem"
                                        px="2rem"
                                        h="full"
                                        align="center"
                                        cursor="pointer"
                                        my="auto"
                                        fontWeight="600"
                                        onClick={() =>
                                            widgetApi.current.openDialog()
                                        }
                                    >
                                        Choose File
                                    </Flex>
                                    <Text noOfLines={1} my="auto" px=".5rem">
                                        {contract.name}
                                    </Text>
                                    {showLoading && (
                                        <Flex align="center">
                                            <Text
                                                mb="0"
                                                fontStyle="italic"
                                                mr="1rem"
                                            >
                                                ...loading data info
                                            </Text>
                                            <Spinner />
                                        </Flex>
                                    )}
                                </Flex>
                                <Box display="none">
                                    <Widget
                                        publicKey="fda3a71102659f95625f"
                                        clearable
                                        onFileSelect={showLoadingState}
                                        ref={widgetApi}
                                        systemDialog={true}
                                        inputAcceptTypes={'.docx,.pdf, .doc'}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Box>

                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
                            <Button
                                bgColor="gray.500"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                <Box pr=".5rem">
                                    <RiMailSendFill />
                                </Box>
                                <Box>Add</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            <ExtendContract
                extend={extend}
                clickedItem={clickedItem}
                setExtend={setExtend}
            />
            <ModifyContract
                modify={modify}
                clickedItem={clickedItem}
                setmodify={setModify}
            />
            <ConfirmModal isOpen={opens} onClose={closed} id={clickedItem.id} />
        </>
    );
}

export default ContractTable;
