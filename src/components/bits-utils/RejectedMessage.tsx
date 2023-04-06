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
} from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useContext } from 'react';
import { GrClose } from 'react-icons/gr';
import { InvoiceView } from 'src/services';

function RejectedMessage({
    isOpen,
    onClose,
    clicked,
}: {
    isOpen: boolean;
    onClose: any;
    clicked: InvoiceView | undefined;
}) {
    const { user } = useContext(UserContext);
    // ({ user });
    const status = clicked?.status;

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
                                textTransform="capitalize"
                            >
                                {status?.toLowerCase()} Invoice Message
                            </Text>
                            <Icon
                                as={GrClose}
                                onClick={onClose}
                                cursor="pointer"
                            />
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        <Text fontWeight="700" mb="1rem">
                            Message
                        </Text>
                        <Text fontWeight="500" mb="0" fontSize=".9rem">
                            Hello {user?.fullName}, Invoice with ID{' '}
                            <strong>{clicked?.invoiceReference}</strong> has{' '}
                            {status == 'APPROVED'
                                ? `been viewed and approved by a payroll manager, you can now proceed to mark it as paid. Cheers!`
                                : status == 'PENDING'
                                ? "been submitted to a payroll manager and is pending approval, you'll be notified when the status changes. Cheers!"
                                : status == 'INVOICED'
                                ? 'been invoiced by you, no more actions need to be performed. Cheers!'
                                : clicked?.rejectionReason}
                        </Text>
                        <Button
                            w="full"
                            bgColor="brand.600"
                            color="white"
                            h="3rem"
                            fontSize=".8rem"
                            mt="3rem"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default RejectedMessage;
