import {
    Flex,
    Text,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Box,
    Icon,
    ModalBody,
    Button,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import InputBlank from '../InputBlank';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';

export const CurrencyConversionModal = ({
    isOpen,
    onClose,
    items,
    setUpdateCurrency,
    rebuildInvoiceProcess,
}) => {
    const updateOnChange = (name, value) => {
        setUpdateCurrency((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            // closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '50%']}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader>
                    <>
                        <Flex
                            justify="space-between"
                            align="flex-start"
                            mb="1rem"
                            px="1rem"
                        >
                            <Box w="90%">
                                <Text
                                    fontSize="1.1rem"
                                    fontWeight="500"
                                    userSelect="none"
                                >
                                    Convert To Primary Currency
                                </Text>
                                <Text
                                    fontSize=".9rem"
                                    fontWeight="400"
                                    userSelect="none"
                                >
                                    Some of the amount processed are not in your
                                    primary currency. Please enter the exchange
                                    rate to convert the amount to your primary
                                    currency
                                </Text>
                            </Box>
                            <Icon
                                as={AiOutlineClose}
                                onClick={onClose}
                                cursor={'pointer'}
                            />
                        </Flex>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <VStack align="flex-start" w="full">
                            {items?.map((x) => {
                                const cur = x.currency;
                                return (
                                    <Box
                                        borderTop="1px solid #e5e5e5"
                                        py="1rem"
                                        mt="1rem"
                                        w="full"
                                    >
                                        <InputBlank
                                            label={`${cur} (${getCurrencySymbol(
                                                cur,
                                            )})`}
                                            w="50%"
                                            fontSize=".8rem"
                                            placeholder="Enter primary currency exchange rate"
                                            onChange={(e) =>
                                                updateOnChange(
                                                    cur,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Box>
                                );
                            })}
                        </VStack>
                        <Box
                            mt="1rem"
                            pt="1rem"
                            mb="6rem"
                            borderTop="1px solid #e5e5e5"
                        >
                            <Button
                                variant="solid"
                                height="2.8rem"
                                width="50%"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="6px"
                                onClick={rebuildInvoiceProcess}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
