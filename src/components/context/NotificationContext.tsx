import { useToast } from '@chakra-ui/react';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import {
    NotificationService,
    NotificationViewPagedCollectionStandardResponse,
} from 'src/services';

export const NotificationContext = createContext<any | null>(null);
export const NotificationProvider = ({ children }: { children: any }) => {
    const [messages, setMessages] =
        useState<NotificationViewPagedCollectionStandardResponse>();
    const toast = useToast();
    const router = useRouter();

    //Getting Notification on Page load
    useEffect(() => {
        const offset = router.query.offset || 0;
        const limit = router.query.limit || 5;

        console.log({ limit, offset });
        const getNotifications = async () => {
            try {
                const data = await NotificationService.listMyNotifications(
                    offset as unknown as number,
                    limit as unknown as number,
                );
                if (data.status) {
                    // console.log({ data });
                    setMessages(data);
                }
            } catch (error: any) {
                console.log({ error });
                // toast({
                //     position: 'top-right',
                //     status: 'error',
                //     title: error?.body?.message || error.message,
                // });
            }
        };
        getNotifications();
    }, []);

    const contextValues = { messages, setMessages };
    return (
        <NotificationContext.Provider value={contextValues}>
            {children}
        </NotificationContext.Provider>
    );
};
