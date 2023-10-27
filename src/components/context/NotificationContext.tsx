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
    const [loading, setLoading] = useState(false);

    //Mark as read
    const markAsRead = async (id) => {
        try {
            setLoading(true);
            const data = await NotificationService.markAsRead(id);
            //
            if (data.status) {
                setLoading(false);
                router.replace(router.asPath);
            }
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error.body.message || error.message,
                position: 'top-right',
                status: 'error',
            });
        }
    };

    //Getting Notification on Page load
    useEffect(() => {
        const offset = router.query.offset || 0;
        const limit = router.query.limit || 6;

        //
        const getNotifications = async () => {
            try {
                const data = await NotificationService.listMyNotifications(
                    offset as unknown as number,
                    limit as unknown as number,
                );
                if (data.status) {
                    //
                    setMessages(data);
                    // toast({
                    //     position: 'top-right',
                    //     status: 'success',
                    //     title: 'Notification up to date',
                    // });
                }
            } catch (error: any) {
                toast({
                    position: 'top-right',
                    status: 'error',
                    title: error?.body?.message || error.message,
                });
            }
        };
        getNotifications();
    }, []);

    const contextValues = { messages, setMessages, markAsRead, loading };
    return (
        <NotificationContext.Provider value={contextValues}>
            {children}
        </NotificationContext.Provider>
    );
};
