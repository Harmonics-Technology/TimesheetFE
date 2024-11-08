import {
    Box,
    Button,
    HStack,
    Icon,
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    AttachmentModel,
    AttachmentView,
    ProjectManagementService,
    ProjectView,
} from 'src/services';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TableRow, TableData } from '@components/bits-utils/TableData';
import moment from 'moment';
import { TableCard } from '../../Generics/TableCard';
import { TbTrash } from 'react-icons/tb';
import { useRouter } from 'next/router';
import axios from 'axios';
import fileDownload from 'js-file-download';
import { ShowPrompt } from '../../Modals/ShowPrompt';
import { AddAttachmentModal } from '../../Modals/AddAttachmentModal';
import { AttachmentDetailModal } from '../../Modals/AttachmentDetailModal';
import { TeamTopBar } from './TeamTopBar';
import { IoDocumentAttach } from 'react-icons/io5';
import { BsDownload } from 'react-icons/bs';

export const TeamDocumentsPage = ({
    id,
    project,
    files,
}: {
    id: any;
    project: ProjectView;
    files: AttachmentView[];
}) => {
    const tableHead = [
        'Document Name',
        'Date Attached',
        'File Type',
        'Size',
        '',
    ];

    const [loading, setLoading] = useState({ id: '' });
    const [fileData, setFileData] = useState<AttachmentView | null>();
    const {
        isOpen: uploadOpen,
        onOpen: onUploadOpen,
        onClose: onUploadClose,
    } = useDisclosure();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: openDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete,
    } = useDisclosure();
    const toast = useToast();

    const router = useRouter();

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

    const uploadAttachement = async (info) => {
        setLoading({ id: 'files' });
        const data: AttachmentModel = {
            projectId: project.id,
            // projectTaskId: taskId,
            fileUrl: info?.cdnUrl,
            title: info?.name,
            extension: info?.mimeType?.split('/')[1],
        };
        try {
            const res = await ProjectManagementService.addAttachment(data);
            if (res?.status) {
                router.replace(router?.asPath);
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
    const deleteAttachement = async () => {
        try {
            const res = await ProjectManagementService.deleteAttachment(
                fileData?.id,
            );
            if (res?.status) {
                router.replace(router?.asPath);
                onCloseDelete();
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

    const setDataFile = (value: AttachmentView) => {
        setFileData(value);
        onOpen();
    };
    const triggerDeleteModal = (value: AttachmentView) => {
        setFileData(value);
        onOpenDelete();
    };

    return (
        <Box>
            <TeamTopBar data={project} id={id} />
            <HStack py="1rem" justify="space-between" mt="1rem">
                <Button
                    onClick={onUploadOpen}
                    bgColor="brand.400"
                    color="white"
                    h="2rem"
                    borderRadius=".3rem"
                    fontSize=".8rem"
                >
                    <Icon as={IoDocumentAttach} />
                    <Text> Upload Document</Text>
                </Button>
                <SubSearchComponent />
            </HStack>
            <Box>
                <TableCard tableHead={tableHead}>
                    {files?.map((x: AttachmentView, i) => {
                        return (
                            <TableRow key={i}>
                                <TableData
                                    name={x?.title}
                                    fontWeight="500"
                                    full
                                    breakWord
                                    onClick={() => setDataFile(x)}
                                />
                                <TableData
                                    name={moment(x?.dateCreated).format(
                                        'DD/MM/YYYY hh:mm A',
                                    )}
                                    fontWeight="500"
                                    onClick={() => setDataFile(x)}
                                />
                                <TableData
                                    name={x?.extension}
                                    fontWeight="500"
                                    onClick={() => setDataFile(x)}
                                />
                                <TableData
                                    name={x?.extension}
                                    fontWeight="500"
                                    onClick={() => setDataFile(x)}
                                />

                                <td>
                                    <HStack
                                        color="gray.600"
                                        fontSize="1rem"
                                        cursor="pointer"
                                    >
                                        {loading?.id === x?.fileUrl ? (
                                            <Spinner />
                                        ) : (
                                            <Icon
                                                as={BsDownload}
                                                onClick={() => downloadFile(x)}
                                            />
                                        )}
                                        <Icon
                                            as={TbTrash}
                                            onClick={() =>
                                                triggerDeleteModal(x)
                                            }
                                        />
                                    </HStack>
                                </td>
                            </TableRow>
                        );
                    })}
                </TableCard>
                {/* <Pagination data={files} loadMore /> */}

                {openDelete && (
                    <ShowPrompt
                        isOpen={openDelete}
                        onClose={onCloseDelete}
                        onSubmit={deleteAttachement}
                        loading={loading}
                        text={`Are you sure you want to delete this attachement? <br/> This action cannot be undone`}
                    />
                )}

                {isOpen && (
                    <AttachmentDetailModal
                        isOpen={isOpen}
                        onClose={onClose}
                        data={fileData as AttachmentView}
                    />
                )}
                {uploadOpen && (
                    <AddAttachmentModal
                        isOpen={uploadOpen}
                        onClose={onUploadClose}
                        isLoading={loading}
                        setLoading={setLoading}
                        uploadAttachement={uploadAttachement}
                    />
                )}
            </Box>
        </Box>
    );
};
