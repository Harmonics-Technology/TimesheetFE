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
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import BeatLoader from 'react-spinners/BeatLoader';
import { TeamMemberModel } from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { Widget } from '@uploadcare/react-widget';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';

const schema = yup.object().shape({});

export const CreateProjectDrawer = ({ onClose, isOpen }) => {
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
    const widgetApi = useRef<any>();
    const onSubmit = async (data: TeamMemberModel) => {
        console.log({ data });
    };
    const [fileDoc, setFileDoc] = useState<any>();
    const uploadFunction = (file) => {
        console.log({ file });
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
            title={'Create A New Project'}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1rem">
                    <PrimaryInput<TeamMemberModel>
                        label="Project Name"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                        gap="1rem 1rem"
                    >
                        <PrimaryDate<TeamMemberModel>
                            control={control}
                            name="dateOfBirth"
                            label="Start Date"
                            error={errors.dateOfBirth}
                            max={new DateObject().subtract(1, 'days')}
                        />

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
                    </Grid>
                    <PrimaryInput<TeamMemberModel>
                        label="Budget"
                        name="address"
                        error={errors.address}
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
                            Assign this Project to
                        </FormLabel>

                        <CustomSelectBox
                            data={userOptions}
                            updateFunction={addUser}
                            items={selectedUser}
                            customKeys={{ key: 'id', label: 'fullName' }}
                            removeFn={removeUser}
                            id="selectUser"
                        />
                        <Box
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
                        </Box>
                    </Box>
                    <PrimaryInput<TeamMemberModel>
                        label="Notes"
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
                            Upload Document or Requirement
                        </FormLabel>
                        <Flex
                            border="1px dashed #9E9E9E"
                            h="6.8rem"
                            align="center"
                            justify="center"
                            w="full"
                        >
                            <VStack
                                color="black"
                                fontSize=".8rem"
                                align="center"
                                cursor="pointer"
                                fontWeight="600"
                                onClick={() => widgetApi.current.openDialog()}
                            >
                                <Icon
                                    as={AiOutlineCloudUpload}
                                    fontSize="2rem"
                                />
                                <Text noOfLines={1} mb="0">
                                    Upload
                                </Text>
                                <Text noOfLines={1} mb="0">
                                    Drag and drop or Browse
                                </Text>
                            </VStack>
                            <Box display="none">
                                <Widget
                                    publicKey="fda3a71102659f95625f"
                                    clearable
                                    onFileSelect={uploadFunction}
                                    ref={widgetApi}
                                    systemDialog={true}
                                    inputAcceptTypes={'.docx,.pdf, .doc'}
                                />
                            </Box>
                        </Flex>
                    </Box>
                    <Flex
                        bgColor="#C2CFE0"
                        borderRadius="25px"
                        border="1px solid #C2CFE0"
                        h="1.6rem"
                        px="1.5rem"
                        fontSize=".6rem"
                        color="white"
                        justify="center"
                        align="center"
                    >
                        {fileDoc?.name} PDF DOC
                    </Flex>

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
