import DrawerWrapper from '@components/bits-utils/Drawer';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TrainingModel, TrainingService } from 'src/services';
import {
    Box,
    Button,
    DrawerFooter,
    Flex,
    FormLabel,
    HStack,
    Icon,
    Image,
    Square,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import BeatLoader from 'react-spinners/BeatLoader';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import Link from 'next/link';
import { MdCancel, MdDelete } from 'react-icons/md';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { Widget } from '@uploadcare/react-widget';
import InputBlank from '@components/bits-utils/InputBlank';
import { BiPlus } from 'react-icons/bi';
import generateRandomUUID from '@components/generics/generateRandomUUID';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';

export const AddTrainingModal = ({ onClose, isOpen, users, superAdminId }) => {
    const schema = yup.object().shape({
        name: yup.string().required(),
    });
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TrainingModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            isAllParticipant: true,
        },
    });
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
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
    const [uploadedFiles, setUploadedFiles] = useState<any>([]);
    const [fileType, setFileType] = useState('Select a Category');
    const [documentFile, setDocumentFile] = useState<any>({
        title: '',
        fileUrl: '',
        id: '',
        loading: false,
        category: '',
    });
    const [docFile, setDocFile] = useState<any>([]);
    const noLinkSetUp = !documentFile.title || !documentFile.fileUrl;
    const addToList = () => {
        if (noLinkSetUp) {
            return;
        }

        setDocumentFile({ title: '', fileUrl: '' });
        setUploadedFiles([
            ...uploadedFiles,
            { ...documentFile, id: generateRandomUUID(), category: fileType },
        ]);
        setFileType('Select a Category');
        return;
    };
    const removeFromList = (data: any) => {
        const foundItems = uploadedFiles.filter((x) => !(x.id === data.id));
        setUploadedFiles(foundItems);
    };
    const widgetApi = useRef<any>();
    const uploadFunction = async (group) => {
        const files = group.files();
        files.forEach((file) => {
            file.progress(() => {
                setDocumentFile({ loading: true });
            });
            file.done((info) => {
                setDocumentFile({
                    loading: false,
                    fileUrl: info?.cdnUrl,
                    title: info?.name,
                });
                // setDocFile([
                //     ...docFile,
                //     {
                //         loading: false,
                //         fileUrl: info?.cdnUrl,
                //         title: info?.name,
                //     },
                // ]);
            });
        });
    };
    const toast = useToast();
    const router = useRouter();
    const isAllParticipant =
        String(watch('isAllParticipant')) === 'Everybody' ||
        watch('isAllParticipant') === true
            ? true
            : false;
    const onSubmit = async (data: TrainingModel) => {
        data.superAdminId = superAdminId;
        data.assignedUsers = selectedUser.map((x) => x.id);
        data.isAllParticipant = isAllParticipant;
        data.trainingFiles = uploadedFiles.map((x) => ({
            title: x.title,
            fileUrl: x.fileUrl,
            category: x.category,
        }));
        try {
            const result = await TrainingService.addTraining(data);
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
        <DrawerWrapper onClose={onClose} isOpen={isOpen} title={'Add Training'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" gap="1.5rem">
                    <PrimaryInput<TrainingModel>
                        label="Training Name"
                        name="name"
                        error={errors.name}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <PrimaryRadio<TrainingModel>
                        label="Who should participate in this training ?"
                        radios={['Everybody', 'Specific team members']}
                        name="isAllParticipant"
                        control={control}
                        error={errors.isAllParticipant}
                        defaultValue={'Everybody'}
                    />
                    {!isAllParticipant && (
                        <Box w="full">
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Select Team member
                            </FormLabel>

                            <CustomSelectBox
                                data={users?.value}
                                updateFunction={addUser}
                                items={selectedUser}
                                customKeys={{ key: 'id', label: 'fullName' }}
                                removeFn={removeUser}
                                id="Assign user"
                                error={errors.assignedUsers}
                                searchable
                            />
                            <HStack justify="flex-end" mt=".5rem">
                                <Link
                                    passHref
                                    href={`/${role}/profile-management/team-members`}
                                >
                                    <Button
                                        bgColor="#2383BD"
                                        px="1rem"
                                        h="24px"
                                        color="white"
                                        fontSize="10px"
                                    >
                                        Add Team Member
                                    </Button>
                                </Link>
                            </HStack>
                            <Box
                                mt="1rem"
                                borderY="1px solid #e5e5e5"
                                w="full"
                                py="1rem"
                            >
                                {selectedUser?.length > 0 && (
                                    <HStack mb=".5rem" flexWrap="wrap">
                                        {selectedUser?.map((x: any, i: any) => (
                                            <HStack
                                                borderRadius="25px"
                                                border="1px solid #e5e5e5"
                                                fontSize=".6rem"
                                                color="#707683"
                                                key={i}
                                                p=".1rem .4rem"
                                                flexWrap="wrap"
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
                                    These team members were added to this
                                    training
                                </Text>
                            </Box>
                        </Box>
                    )}
                    <SelectBlank
                        label="Category"
                        w="full"
                        placeholder="Select Category"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        options={['Document', 'Video'].map((x) => (
                            <option value={x}>{x}</option>
                        ))}
                    />
                    {fileType == 'Document' ? (
                        <Box>
                            <Text
                                fontSize="13px"
                                fontWeight={500}
                                color="#1a202c"
                                mb="27px"
                            >
                                Upload Files
                            </Text>
                            <Box
                                borderRadius="8px"
                                p="10px 24px 0"
                                h="186px"
                                border="1px dashed"
                                borderColor="brand.100"
                                pos="relative"
                            >
                                <VStack
                                    gap=".8rem"
                                    justify="space-between"
                                    onClick={() =>
                                        widgetApi.current.openDialog()
                                    }
                                >
                                    <Box w="42px" h="42px">
                                        <Image
                                            src="/assets/upload.png"
                                            w="full"
                                            h="full"
                                        />
                                    </Box>
                                    <Text fontSize=".8rem">
                                        Drag your file(s) to start uploading
                                    </Text>
                                    <HStack align="flex-start" gap="1.3rem">
                                        <Box
                                            bgColor="#e7e7e7"
                                            h="1px"
                                            w="80px"
                                        />
                                        <Text fontSize="12px" color="#6d6d6d">
                                            OR
                                        </Text>
                                        <Box
                                            bgColor="#e7e7e7"
                                            h="1px"
                                            w="80px"
                                        />
                                    </HStack>
                                    {documentFile?.title ? (
                                        <Text fontWeight={500} fontSize=".9rem">
                                            {documentFile?.title}
                                        </Text>
                                    ) : (
                                        <Button
                                            bgColor="transparent"
                                            color="brand.400"
                                            borderRadius="8px"
                                            borderColor="brand.400"
                                            border="1px solid"
                                            fontSize="12px"
                                            isLoading={documentFile?.loading}
                                        >
                                            Browse files
                                        </Button>
                                    )}
                                </VStack>
                                <Box
                                    display="block"
                                    pos="absolute"
                                    w="full"
                                    h="full"
                                    top="0"
                                    left="0"
                                    opacity="0"
                                >
                                    <Widget
                                        publicKey="fda3a71102659f95625f"
                                        clearable
                                        onFileSelect={(e) => uploadFunction(e)}
                                        ref={widgetApi}
                                        systemDialog={true}
                                        inputAcceptTypes={'.docx,.pdf, .doc'}
                                        multiple
                                    />
                                </Box>
                            </Box>
                            <Flex justify="flex-end" mt="1rem">
                                <Button
                                    bgColor="transparent"
                                    color="brand.400"
                                    borderRadius="8px"
                                    borderColor="brand.400"
                                    border="1px solid"
                                    fontSize="12px"
                                    onClick={() => addToList()}
                                    isDisabled={noLinkSetUp}
                                >
                                    <Icon as={BiPlus} /> Add
                                </Button>
                            </Flex>
                        </Box>
                    ) : fileType == 'Video' ? (
                        <Box w="full">
                            <Text
                                fontSize="13px"
                                fontWeight={500}
                                color="#1a202c"
                                mb="27px"
                            >
                                Insert Video Link
                            </Text>
                            <HStack gap="2rem">
                                <InputBlank
                                    label="Title"
                                    onChange={(e) =>
                                        setDocumentFile({
                                            ...documentFile,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <InputBlank
                                    label="Video Link"
                                    onChange={(e) =>
                                        setDocumentFile({
                                            ...documentFile,
                                            fileUrl: e.target.value,
                                        })
                                    }
                                />
                            </HStack>
                            <Flex justify="flex-end" mt="1rem">
                                <Button
                                    bgColor="transparent"
                                    color="brand.400"
                                    borderRadius="8px"
                                    borderColor="brand.400"
                                    border="1px solid"
                                    fontSize="12px"
                                    onClick={() => addToList()}
                                    isDisabled={noLinkSetUp}
                                >
                                    <Icon as={BiPlus} /> Add
                                </Button>
                            </Flex>
                        </Box>
                    ) : null}
                    {uploadedFiles.length > 0 && (
                        <Box mt="2rem">
                            <Text
                                fontSize="13px"
                                fontWeight={500}
                                color="#1a202c"
                                mb="10px"
                            >
                                Uploaded Files
                            </Text>
                            <HStack gap="1rem">
                                {uploadedFiles?.map((x: any) => (
                                    <Box pos="relative">
                                        <Square
                                            borderRadius="6px"
                                            size="4rem"
                                            overflow="hidden"
                                        >
                                            <Image src="/assets/upload.png" />
                                        </Square>
                                        <Text fontSize=".7rem">{x.title}</Text>
                                        <Box pos="absolute" top="0" right="-2%">
                                            <Icon
                                                as={MdDelete}
                                                onClick={() =>
                                                    removeFromList(x.id)
                                                }
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </HStack>
                        </Box>
                    )}
                    <PrimaryTextarea<TrainingModel>
                        label="Note"
                        name="note"
                        error={errors.note}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                </VStack>
                <DrawerFooter my="2rem" p="0" w="full">
                    <Flex justify="space-between" w="full" gap="2rem">
                        <Button
                            bgColor="#FF5B79"
                            color="white"
                            height="3rem"
                            fontSize="14px"
                            onClick={() => onClose()}
                            w="full"
                            borderRadius="8px"
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
                            w="full"
                            borderRadius="8px"
                        >
                            Create Training
                        </Button>
                    </Flex>
                </DrawerFooter>
            </form>
        </DrawerWrapper>
    );
};
