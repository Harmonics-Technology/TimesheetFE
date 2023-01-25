import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Tr,
} from '@chakra-ui/react';
import InvoiceTotalText from '@components/bits-utils/InvoiceTotalText';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import { useRef } from 'react';
import {
    ExpenseView,
    InvoiceView,
    PayrollView,
    RejectTimeSheetModel,
} from 'src/services';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';
import { PrimaryTextarea } from './PrimaryTextArea';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { GrClose } from 'react-icons/gr';

function RejectInvoiceModal({
    isOpen,
    onClose,
    clicked,
}: {
    isOpen: boolean;
    onClose: any;
    clicked: InvoiceView | undefined;
}) {
    const schema = yup.object().shape({
        reason: yup.string().required(),
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<RejectTimeSheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    console.log({ clicked });

    const onSubmit = async (data: RejectTimeSheetModel) => {
        // data.id = clicked.id;
        // console.log({ data });
        // try {
        //     const result = await TimeSheetService.rejectTimeSheetForADay(data);
        //     if (result.status) {
        //         console.log({ result });
        //         router.reload();
        //         return;
        //     }
        //     console.log({ result });
        // } catch (error) {
        //     console.log({ error });
        //     toast({
        //         title: 'An error occured',
        //         status: 'error',
        //         position: 'top-right',
        //     });
        // }
    };
    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(90deg)"
                />
                <ModalContent
                    py={5}
                    borderRadius="0"
                    w={['88%', '30%']}
                    maxW="unset"
                    overflow="hidden"
                    // maxH="100vh"
                    mt="0"
                    mb="0"
                >
                    <ModalHeader>
                        <Flex justify="space-between">
                            <Text
                                color="black"
                                fontSize="1.1rem"
                                textAlign="left"
                                fontWeight="semibold"
                            >
                                Reject Invoice
                            </Text>
                            <Icon
                                as={GrClose}
                                onClick={onClose}
                                cursor="pointer"
                            />
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <PrimaryTextarea<RejectTimeSheetModel>
                                label="Reason"
                                name="reason"
                                error={errors.reason}
                                placeholder=""
                                defaultValue=""
                                h="5.5rem"
                                register={register}
                            />
                            <Button
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size="10" />}
                                type="submit"
                                w="full"
                                bgColor="brand.600"
                                color="white"
                                h="3rem"
                                fontSize=".8rem"
                            >
                                Reject
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default RejectInvoiceModal;
