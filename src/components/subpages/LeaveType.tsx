import {
    useDisclosure,
    useToast,
    Box,
    Button,
    Tr,
    DrawerFooter,
    Grid,
    Text,
    Flex,
    Icon as Icons,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Pagination from '@components/bits-utils/Pagination';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { TableData, TableState } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import {
    LeaveTypeModel,
    LeaveService,
    LeaveTypeView,
    LeaveTypeViewPagedCollectionStandardResponse,
} from 'src/services';
// import { Icon } from 'icon-picker-react';
import { ChooseIconModal } from '@components/bits-utils/ChooseIconModal';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsPencilFill } from 'react-icons/bs';
import IconPicker, { IconPickerItem } from 'react-icons-picker';

const schema = yup.object().shape({
    name: yup.string().required(),
});
interface leaveProps {
    leaves: LeaveTypeViewPagedCollectionStandardResponse;
}

export const LeaveType = ({ leaves }: leaveProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LeaveTypeModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    const [data, setData] = useState<any>();

    const openModal = (x) => {
        setData(x);
        onOpen();
    };
    const [iconLabel, setIconLabel] = useState('FaUsers');
    const [loading, setLoading] = useState(false);
    const id = data?.id;

    const onSubmit = async (data: LeaveTypeModel) => {
        data.leaveTypeIcon = iconLabel;
        try {
            const result = await LeaveService.addLeaveType(data);
            if (result.status) {
                toast({
                    title: `Successfully created`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
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
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const editLeaveType = async (data: LeaveTypeModel) => {
        data.leaveTypeIcon = data.leaveTypeIcon || iconLabel;

        try {
            const result = await LeaveService.updateLeaveType(id, data);
            if (result.status) {
                toast({
                    title: `Leave type updated`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
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
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const deleteLeave = async (id: string) => {
        setLoading(true);
        try {
            const result = await LeaveService.deleteLeaveType(id);
            if (result.status) {
                setLoading(false);
                toast({
                    title: `Leave type deleted`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
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
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Button
                    bgColor="brand.400"
                    color="white"
                    p=".5rem 1.5rem"
                    height="fit-content"
                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    onClick={onOpen}
                    mb="1rem"
                >
                    +Leave Type
                </Button>
                <FilterSearch />
                <Tables
                    tableHead={['Leave Type', 'Status', 'Modify', 'Delete']}
                >
                    <>
                        {leaves?.data?.value?.map((x: LeaveTypeView) => (
                            <Tr key={x.id}>
                                <td>
                                    <Flex align="center" gap=".5rem">
                                        <IconPickerItem
                                            value={x.leaveTypeIcon}
                                        />
                                        {x.name}
                                    </Flex>
                                </td>
                                <TableState name={'ACTIVE'} />
                                <td>
                                    <Icons
                                        as={BsPencilFill}
                                        fontSize="1rem"
                                        cursor="pointer"
                                        onClick={() => openModal(x)}
                                    />
                                </td>
                                <td>
                                    {loading ? (
                                        <BeatLoader size={8} color="black" />
                                    ) : (
                                        <Icons
                                            as={RiDeleteBin6Line}
                                            fontSize="1rem"
                                            cursor="pointer"
                                            onClick={() =>
                                                deleteLeave(x?.id as string)
                                            }
                                        />
                                    )}
                                </td>
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={leaves} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add New Leave Type'}
            >
                <form>
                    <PrimaryInput<LeaveTypeModel>
                        label="Leave Type"
                        name="name"
                        error={errors.name}
                        placeholder="Leave Type"
                        defaultValue={data?.name || ''}
                        register={register}
                    />
                    <Button
                        mt="1rem"
                        p=".5rem"
                        // onClick={() =>
                    >
                        <IconPicker
                            onChange={(v) => setIconLabel(v)}
                            value={data?.leaveTypeIcon || iconLabel}
                        />
                        {/* <Icon icon={data?.icon || iconLabel} /> */}
                        <Text
                            mb="0"
                            ml=".5rem"
                            pos="absolute"
                            pointerEvents="none"
                        >
                            Choose Icon
                        </Text>
                    </Button>

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
                                // type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={
                                    data !== undefined
                                        ? handleSubmit(editLeaveType)
                                        : handleSubmit(onSubmit)
                                }
                            >
                                <Box>Save</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            {/* <ChooseIconModal
                setIconLabel={setIconLabel}
                onClose={onCloses}
                isOpen={isOpens}
            /> */}
        </>
    );
};
