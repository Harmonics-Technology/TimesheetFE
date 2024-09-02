import { useRouter } from 'next/router';
import { ProjectManagementService } from 'src/services';
import { useToastMessages } from '../useToastMessages';

export default async function markAsCompleted(
    data,
    setLoading,
    toast,
    setStatus,
    router,
    onClosed,
) {
    // const { showToastSuccess, showToastError } = useToastMessages();
    if (data?.isCompleted) {
        toast({
            title: 'Item has already been marked as completed',
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
        onClosed();
        return;
    }
    data.isCompleted = true;
    setLoading({ id: data.taskId });
    try {
        const result =
            await ProjectManagementService.markProjectOrTaskAsCompleted(data);
        if (result.status) {
            toast({
                title: 'Success',
                status: 'success',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
            router.replace(router.asPath);
            setStatus('completed');
            router.reload();
            onClosed();
            return;
        }
        toast({
            title: result.message,
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
        setLoading({ id: '' });
    } catch (error) {
        toast({
            title: `Check your network connection and try again`,
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
        setLoading({ id: '' });
    }
    return;
}
