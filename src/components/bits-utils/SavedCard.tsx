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
import { CardField } from '@components/subpages/ManageSub/CardField';

export const SavedCard = ({
    isDefault,
    data,
    setIsEditing,
}: {
    isDefault?: boolean;
    data: Card;
    setIsEditing?: any;
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
                <CardField data={data} icon />
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
                            onClick={() => setIsEditing(data)}
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
                                Company Email:
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
