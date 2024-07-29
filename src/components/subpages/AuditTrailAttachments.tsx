import {
    Avatar,
    Box,
    Flex,
    HStack,
    Icon,
    Image,
    Spinner,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import axios from 'axios';
import fileDownload from 'js-file-download';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { BsDownload, BsEye } from 'react-icons/bs';
import { GrAttachment } from 'react-icons/gr';
import Skeleton from 'react-loading-skeleton';
import {
    AttachmentModel,
    AttachmentView,
    ProjectManagementService,
} from 'src/services';

export const AuditTrailAttachments = ({ taskId }: { taskId: string }) => {
    const [activities, setActivities] = useState<AttachmentView[]>([]);
    const [refetch, setRefetch] = useState(false);
    const [loading, setLoading] = useState({ id: '' });
    const toast = useToast();
    const widgetApi = useRef<any>(null);

    const downloadFile = (file: AttachmentView) => {
        setLoading({ id: file?.fileUrl as string });
        axios
            .get(file?.fileUrl as string, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, `${file?.title}`);
                setLoading({ id: '' });
            });
    };
    const viewDoc = (url: any) => {
        window.open(url, '_blank');
    };

    const fetchAuditData = async () => {
        setLoading({ id: 'fetching' });
        try {
            const res = await ProjectManagementService.listAttachments(taskId);
            if (res?.status) {
                setLoading({ id: '' });
                setActivities(res?.data as AttachmentView[]);
                return;
            }
            setLoading({ id: '' });
            toast({
                title: res?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const uploadAttachement = async (info) => {
        const data: AttachmentModel = {
            projectTaskId: taskId,
            fileUrl: info?.cdnUrl,
            title: info?.name,
            extension: info?.mimeType?.split('/')[1],
        };
        try {
            const res = await ProjectManagementService.addAttachment(data);
            if (res?.status) {
                setRefetch((prev) => !prev);
                setLoading({ id: '' });
            }
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const uploadFunction = async (file) => {
        file.progress(() => {
            setLoading({ id: 'uploading' });
        });
        file.done((info) => {
            uploadAttachement(info);
        });
    };

    useEffect(() => {
        if (taskId) {
            fetchAuditData();
        }
    }, [refetch]);

    return (
        <HStack py="1rem" justify="space-between" align="flex-start">
            <>
                {loading?.id == 'fetching' ? (
                    <Box w="90%">
                        <Skeleton height="6rem" count={1} />
                    </Box>
                ) : (
                    <>
                        {activities?.length > 0 ? (
                            <HStack gap="1rem">
                                {activities?.map((x) => (
                                    <Box w="170px" key={x?.id}>
                                        <Flex
                                            border="0.55px solid"
                                            borderColor="#6A7F9D"
                                            borderRadius="15px"
                                            h="130px"
                                            w="115px"
                                            justify="center"
                                            align="center"
                                            overflow="hidden"
                                        >
                                            <Image
                                                src={
                                                    x?.extension == 'jpeg' ||
                                                    x?.extension == 'png'
                                                        ? (x?.fileUrl as string)
                                                        : x?.extension == 'pdf'
                                                        ? '/assets/pdf.png'
                                                        : x?.extension ==
                                                              'doc' ||
                                                          x?.extension == 'docx'
                                                        ? '/assets/doc.png'
                                                        : '/assets/unknown.png'
                                                }
                                                w="80%"
                                                mx="auto"
                                                objectFit="contain"
                                            />
                                        </Flex>
                                        <VStack
                                            gap=".1rem"
                                            align="flex-start"
                                            mt="15px"
                                        >
                                            <HStack
                                                color="#a6acbe"
                                                fontSize="13px"
                                                cursor="pointer"
                                            >
                                                {loading?.id == x?.fileUrl ? (
                                                    <Spinner size="xs" />
                                                ) : (
                                                    <Icon
                                                        as={BsDownload}
                                                        onClick={() =>
                                                            downloadFile(x)
                                                        }
                                                    />
                                                )}
                                                <Icon
                                                    as={BsEye}
                                                    onClick={() =>
                                                        viewDoc(x?.fileUrl)
                                                    }
                                                />
                                            </HStack>
                                            <Text
                                                fontSize="11px"
                                                fontWeight={500}
                                                color="#1a202c"
                                                noOfLines={1}
                                            >
                                                {x.title}
                                            </Text>
                                            <Text
                                                fontSize="10px"
                                                fontWeight={400}
                                                color="#c4c4c4"
                                            >
                                                {moment(
                                                    x?.dateCreated,
                                                ).fromNow()}
                                            </Text>
                                            <Text
                                                color="#2D3748"
                                                fontSize="11px"
                                                fontWeight={400}
                                            >
                                                File attached by
                                            </Text>
                                            <HStack gap=".1rem">
                                                <Avatar
                                                    size={'xs'}
                                                    name={
                                                        x?.createdByUser
                                                            ?.fullName as string
                                                    }
                                                    src={
                                                        x?.createdByUser
                                                            ?.profilePicture as string
                                                    }
                                                    bgColor="gray.300"
                                                    color="white"
                                                />
                                                <Text
                                                    color="#2D3748"
                                                    fontSize="11px"
                                                    fontWeight={400}
                                                >
                                                    {x?.createdByUser?.fullName}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                ))}
                            </HStack>
                        ) : (
                            <HStack justify="center">
                                <Text textAlign="center" fontSize="13px">
                                    Add a new attachement to see attachements
                                </Text>
                            </HStack>
                        )}
                    </>
                )}
            </>
            <HStack
                bgColor="#E7E7E7"
                borderRadius="5px"
                color="#2D3748"
                h="35px"
                px="10px"
                gap="6px"
                pos="relative"
                fontSize="13px"
                fontWeight={500}
                cursor="pointer"
                overflow="hidden"
            >
                {loading?.id == 'uploading' ? (
                    <Spinner size="sm" />
                ) : (
                    <>
                        <Icon as={GrAttachment} />
                        <Text>Attach</Text>
                    </>
                )}
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
                        inputAcceptTypes={'.docx,.pdf, .doc,.png,.jpg'}
                        // multiple
                    />
                </Box>
            </HStack>
        </HStack>
    );
};
