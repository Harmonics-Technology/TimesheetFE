import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Text,
    Box,
    HStack,
    useToast,
    Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaTimesCircle, FaTrash } from "react-icons/fa";
import { ContractService } from "src/services";

type Props = {
    isOpen?: any;
    onClose?: any;
    id: any;
};

const ConfirmModal = ({ isOpen, onClose, id }: Props) => {
    // console.log({ id });
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const terminateContract = async (data: string) => {
        console.log(data);
        try {
            setLoading(true);
            const result = await ContractService.terminateContract(data);
            if (result.status) {
                toast({
                    title: "Contract Terminated",
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                setLoading(false);
                router.reload();
                onClose();
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log({ error });
        }
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={["88%", "30%"]}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Flex
                            justify="center"
                            color="red"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <FaTimesCircle />
                        </Flex>
                        <Text
                            fontSize="1.1rem"
                            mb="1rem"
                            px={["1.5rem", "3.3rem"]}
                            fontWeight="500"
                        >
                            Are you sure you want to terminate this contract?
                            <br />
                            This action can not be undone
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <HStack px=".8rem" spacing={4} w="full">
                            <Button
                                variant="outline"
                                height="3rem"
                                width="full"
                                borderColor="black"
                                // bgColor="black"
                                // _hover={{
                                //   bgColor: 'white',
                                //   color: 'black',
                                //   border: '1px solid',
                                //   borderColor: 'black',
                                // }}
                                onClick={onClose}
                            >
                                No
                            </Button>
                            <Button
                                variant="solid"
                                height="3rem"
                                width="full"
                                bgColor="red"
                                color="white"
                                // _hover={{
                                //   bgColor: 'white',
                                //   color: 'brand.800',
                                //   border: '1px solid',
                                //   borderColor: 'brand.800',
                                // }}

                                isLoading={loading}
                                onClick={() => terminateContract(id)}
                            >
                                Yes
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmModal;
