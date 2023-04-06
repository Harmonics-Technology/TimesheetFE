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
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableData,
    TableState,
    ToggleStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ExpenseTypeView, SettingsService } from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import FilterSearch from '@components/bits-utils/FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';

const schema = yup.object().shape({
    name: yup.string().required(),
});
interface expenseProps {
    expenses: ExpenseTypeView[];
}
interface ExpenseCreate {
    name: string;
}

function ExpenseType({ expenses }: expenseProps) {
    console.log({ expenses });
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseCreate>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    const onSubmit = async (data: ExpenseCreate) => {
        const body = data.name;
        try {
            const result = await SettingsService.createExpenseType(body);
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
        } catch (err) {
            toast({
                title: 'An error occurred',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    function setFilter(filter: string) {
        router.push({
            query: {
                limit: filter,
            },
        });
    }
    function search(term: string) {
        router.push({
            query: {
                search: term,
            },
        });
    }
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
                    +Expense Type
                </Button>
                <FilterSearch />
                <Tables tableHead={['Expense Type', 'Status', '']}>
                    <>
                        {expenses?.map((x: ExpenseTypeView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableState name={x.status as string} />
                                <ToggleStatus
                                    id={x.id}
                                    status={x.status as string}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={expenses} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add New Expense Type'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PrimaryInput<ExpenseCreate>
                        label="Expense Type"
                        name="name"
                        error={errors.name}
                        placeholder="Expense Type"
                        defaultValue=""
                        register={register}
                    />

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
                                <Box>Save</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
        </>
    );
}

export default ExpenseType;
