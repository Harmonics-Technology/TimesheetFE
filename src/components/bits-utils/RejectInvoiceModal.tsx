import {
    Button,
    Flex,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react';
import {
    FinancialService,
    InvoiceView,
    RejectPaymentPartnerInvoiceModel,
} from 'src/services';
import { PrimaryTextarea } from './PrimaryTextArea';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { GrClose } from 'react-icons/gr';
import { useRouter } from 'next/router';

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
        rejectionReason: yup.string().required(),
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<RejectPaymentPartnerInvoiceModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const router = useRouter();
    const toast = useToast();

    const onSubmit = async (data: RejectPaymentPartnerInvoiceModel) => {
        data.invoiceId = clicked?.id;

        try {
            const result = await FinancialService.rejectPaymentPartnerInvoice(
                data,
            );
            if (result.status) {
                router.replace(router.asPath);
                return;
            }
        } catch (error) {
            toast({
                title: 'An error occured',
                status: 'error',
                position: 'top-right',
            });
        }
    };
    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
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
                            <PrimaryTextarea<RejectPaymentPartnerInvoiceModel>
                                label="Reason"
                                name="rejectionReason"
                                error={errors.rejectionReason}
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
