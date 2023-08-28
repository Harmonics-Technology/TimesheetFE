import {
    Box,
    Button,
    DrawerFooter,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Text,
    VStack,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import BeatLoader from 'react-spinners/BeatLoader';
import { TeamMemberModel } from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';

const schema = yup.object().shape({});

export const AddSubTaskDrawer = ({ onClose, isOpen }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const isHours =
        (watch('isActive') as unknown as string) == 'Track by hours'
            ? true
            : false;
    const onSubmit = async (data: TeamMemberModel) => {
        console.log({ data });
    };
    const [selectedUser, setSelecedUser] = useState<any>([]);
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };
    const userOptions = [
        {
            id: 'javascript',
            fullName: 'Javascript',
        },
        {
            id: 'go',
            fullName: 'Go',
        },
        {
            id: 'ruby',
            fullName: 'Ruby On Rails',
        },
        {
            id: 'php',
            fullName: 'PHP',
        },
        {
            id: 'csharp',
            fullName: 'C#',
        },
        {
            id: 'java',
            fullName: 'JAVA',
        },
        {
            id: 'python',
            fullName: 'Python',
        },
        {
            id: 'scala',
            fullName: 'Scala',
        },
        {
            id: 'typescript',
            fullName: 'Typescript',
        },
    ];

    console.log(
        userOptions.filter(
            (x) => !selectedUser?.some((user) => user.id === x.id),
        ),
    );

    console.log({ selectedUser });
    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Add New Sub-Task'}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1.5rem">
                    <PrimaryInput<TeamMemberModel>
                        label="Sub-Task Name"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Assign this Sub-task to
                        </FormLabel>

                        <CustomSelectBox
                            data={userOptions}
                            updateFunction={addUser}
                            items={selectedUser}
                            customKeys={{ key: 'id', label: 'fullName' }}
                            checkbox={false}
                            id="users"
                        />
                        {/* <Box
                            mt="1rem"
                            borderY="1px solid #e5e5e5"
                            w="full"
                            py="1rem"
                        >
                            {selectedUser?.length > 0 && (
                                <HStack mb=".5rem">
                                    {selectedUser?.map((x: any, i: any) => (
                                        <HStack
                                            borderRadius="25px"
                                            border="1px solid #e5e5e5"
                                            fontSize=".6rem"
                                            color="#707683"
                                            key={i}
                                            p=".1rem .4rem"
                                        >
                                            <Text
                                                fontSize=".6rem"
                                                color="#707683"
                                                mb="0"
                                            >
                                                {x?.fullName}
                                            </Text>
                                            <Icon
                                                as={MdCancel}
                                                onClick={() =>
                                                    removeUser(x?.id)
                                                }
                                            />
                                        </HStack>
                                    ))}
                                </HStack>
                            )}
                            <Text fontSize=".6rem" color="#707683" mb="0">
                                These team members were added to this project
                            </Text>
                        </Box> */}
                    </Box>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                        gap="1rem 1rem"
                        w="full"
                    >
                        <PrimaryDate<TeamMemberModel>
                            control={control}
                            name="dateOfBirth"
                            label="End Date"
                            error={errors.dateOfBirth}
                            max={new DateObject().subtract(1, 'days')}
                        />

                        <PrimaryInput<TeamMemberModel>
                            label="Duration"
                            name="firstName"
                            error={errors.firstName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            // readonly={readonly}
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Duration"
                            name="firstName"
                            error={errors.firstName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            // readonly={readonly}
                        />
                    </Grid>
                    <PrimaryRadio
                        control={control}
                        error={errors.isActive}
                        radios={['Track by days', 'Track by hours']}
                        name="isActive"
                        flexDir="column"
                        defaultValue={'Track by days'}
                    />
                    {isHours && (
                        <PrimaryInput<TeamMemberModel>
                            label="Duration"
                            name="firstName"
                            error={errors.firstName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            // readonly={readonly}
                        />
                    )}

                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Sub-Task priority
                        </FormLabel>
                        <CustomSelectBox
                            data={userOptions}
                            updateFunction={addUser}
                            items={selectedUser}
                            customKeys={{ key: 'id', label: 'fullName' }}
                            id="priority"
                        />
                    </Box>

                    <PrimaryTextarea<TeamMemberModel>
                        label="Notes"
                        color="#707683"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />

                    <DrawerFooter my="2rem" p="0" w="full">
                        <Flex justify="space-between" w="full">
                            <Button
                                bgColor="#FF5B79"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Cancel
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
                                Save
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </VStack>
            </form>
        </DrawerWrapper>
    );
};
