import {
    Box,
    HStack,
    Button,
    VStack,
    Icon,
    Image,
    Text,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { BsPencilFill, BsTrashFill } from 'react-icons/bs';
import { IconTray } from './IconTray';
import { Card, UserService } from 'src/services';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import { useRouter } from 'next/router';
import { EditSavedCard } from './EditSavedCard';
import { GrSecure } from 'react-icons/gr';

export const SavedCard = ({
    isDefault,
    data,
}: {
    isDefault?: boolean;
    data: Card;
}) => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState({ status: false, type: '' });
    const [editCard, setEditCard] = useState({
        status: false,
        data: {},
    });
    const toast = useToast();
    const router = useRouter();
    const MakeDefaultCard = async () => {
        setLoading({ status: true, type: 'def' });
        try {
            const res = await UserService.setAsDefaulCard(
                user?.id,
                data?.id as string,
            );
            if (res.status) {
                setLoading({ status: false, type: '' });
                router.replace(router.asPath);
                return;
            }
            setLoading({ status: false, type: '' });
            toast({
                title: res.message,
                status: 'error',
            });
        } catch (err: any) {
            setLoading({ status: false, type: '' });
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
            });
        }
    };
    const DeleteCard = async () => {
        setLoading({ status: true, type: 'del' });
        try {
            const res = await UserService.deletePaymentCard(
                user?.id,
                data?.id as string,
            );
            if (res.status) {
                setLoading({ status: false, type: '' });
                toast({
                    title: 'Success!',
                    status: 'success',
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            setLoading({ status: false, type: '' });
            toast({
                title: res.message,
                status: 'error',
            });
        } catch (err: any) {
            setLoading({ status: false, type: '' });
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
            });
        }
    };

    const showEditCard = () => {
        setEditCard({ status: !editCard.status, data });
    };
    return (
        <Box>
            <HStack align="flex-end" gap="1rem">
                <Box
                    borderRadius="0.75rem"
                    border="5px solid #F5F5F5"
                    p="1.7rem"
                    bgColor="white"
                >
                    <HStack spacing=".9rem">
                        {/* "/assets/mastercard.png" */}
                        <Box h="1.5rem" overflow="hidden">
                            <Image
                                src={
                                    data?.brand == 'mastercard'
                                        ? '/assets/mastercard.png'
                                        : data?.brand == 'visa'
                                        ? '/assets/visa.png'
                                        : data?.brand == 'verve'
                                        ? '/assets/verve.png'
                                        : '/assets/card.png'
                                }
                                h="full"
                                w="auto"
                            />
                        </Box>
                        <Text
                            fontWeight="600"
                            color="#252f40"
                            fontSize="1rem"
                            fontFamily="Open Sans"
                        >
                            ****
                        </Text>
                        <Text
                            fontWeight="600"
                            color="#252f40"
                            fontSize="1rem"
                            fontFamily="Open Sans"
                        >
                            ****
                        </Text>
                        <Text
                            fontWeight="600"
                            color="#252f40"
                            fontSize="1rem"
                            fontFamily="Open Sans"
                        >
                            ****
                        </Text>
                        <Text
                            fontWeight="600"
                            color="#252f40"
                            fontSize="1rem"
                            fontFamily="Open Sans"
                        >
                            {data?.lastFourDigit}
                        </Text>
                        <Icon
                            fontWeight="700"
                            fontSize="1rem"
                            as={GrSecure}
                            ml="3rem !important"
                            cursor="pointer"
                        />
                    </HStack>
                </Box>
                {isDefault ? (
                    <Button
                        bgColor="transparent"
                        borderRadius="0.375rem"
                        border="2px solid"
                        borderColor="brand.400"
                        color="brand.400"
                        fontWeight="500"
                        h="2.3rem"
                        onClick={() => MakeDefaultCard()}
                        isLoading={loading.status && loading.type == 'def'}
                    >
                        Set as Default Payment Method
                    </Button>
                ) : (
                    <Text fontSize=".875rem" color="#252f40" fontWeight={500}>
                        Your next billing date is{' '}
                        {formatDate(user?.subscriptiobDetails?.data?.endDate)}
                    </Text>
                )}
            </HStack>
            <Box
                borderRadius="0.75rem"
                bgColor="#F8F9FA"
                p="1.5rem"
                w="100%"
                mt="1rem"
            >
                <HStack justify="space-between" mb="1.5rem">
                    <Text fontWeight="500" color="#252f40" fontSize=".75rem">
                        Billing Information
                    </Text>
                    <HStack spacing="2rem">
                        <IconTray
                            icon={BsTrashFill}
                            color="#F5222D"
                            text="Delete"
                            onClick={DeleteCard}
                            isLoading={loading.status && loading.type == 'del'}
                        />
                        <IconTray
                            icon={BsPencilFill}
                            color="#252F40"
                            text="Edit"
                            onClick={() => showEditCard()}
                        />
                    </HStack>
                </HStack>
                <Text fontSize=".875rem" color="#252f40" mb="1rem">
                    {/* {user?.organizationName} */}
                    {data?.customerName}
                </Text>
                {editCard.status ? (
                    <EditSavedCard
                        setEditCard={setEditCard}
                        data={editCard.data}
                    />
                ) : (
                    <VStack align="flex-start">
                        <HStack>
                            <Text fontSize=".8125rem" color="#67748E" mb="0">
                                Company Name:
                            </Text>
                            <Text fontSize=".8125rem" color="#252f40" mb="0">
                                {data?.customerName}
                            </Text>
                        </HStack>
                        <HStack>
                            <Text fontSize=".8125rem" color="#67748E" mb="0">
                                Company Name:
                            </Text>
                            <Text fontSize=".8125rem" color="#252f40" mb="0">
                                {data?.customerEmail}
                            </Text>
                        </HStack>
                    </VStack>
                )}
            </Box>
        </Box>
    );
};
