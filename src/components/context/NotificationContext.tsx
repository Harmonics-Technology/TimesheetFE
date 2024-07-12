import { useToast } from '@chakra-ui/react';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { NotificationService } from 'src/services';

export const NotificationContext = createContext<any | null>(null);
export const NotificationProvider = ({ children }: { children: any }) => {
    const [messages, setMessages] = useState({});
    const [limit, setLimit] = useState(10);

    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState({ id: '' });

    const offset = router.query.offset || 0;

    //
    const getNotifications = async () => {
        setLoading({ id: 'fetching' });
        try {
            const data = await NotificationService.listMyNotifications(
                offset as unknown as number,
                limit as unknown as number,
            );
            if (data.status) {
                //
                setLoading({ id: '' });
                setMessages(data);
                return;
                // toast({
                //     position: 'top-right',
                //     status: 'success',
                //     title: 'Notification up to date',
                // });
            }
        } catch (error: any) {
            setLoading({ id: '' });
            toast({
                position: 'top-right',
                status: 'error',
                title: error?.body?.message || error.message,
            });
        }
    };

    //Mark as read
    const markAsRead = async (id) => {
        try {
            setLoading({ id });
            const data = await NotificationService.markAsRead(id);
            //
            if (data.status) {
                await getNotifications();
                setLoading({ id: '' });
            }
        } catch (error: any) {
            setLoading({ id: '' });
            toast({
                title: error?.body?.message || error?.message,
                position: 'top-right',
                status: 'error',
            });
        }
    };

    //Getting Notification on Page load
    useEffect(() => {
        getNotifications();
    }, [limit]);

    const contextValues = { messages, markAsRead, loading, setLimit };
    return (
        <NotificationContext.Provider value={contextValues}>
            {children}
        </NotificationContext.Provider>
    );
};
