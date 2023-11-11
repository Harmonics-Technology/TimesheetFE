import { useRouter } from 'next/router';
import { ProjectManagementService } from 'src/services';
import { useToastMessages } from '../useToastMessages';

export default async function markAsCompleted(
    data,
    setLoading,
    toast,
    setStatus,
    router,
) {
    // const { showToastSuccess, showToastError } = useToastMessages();
    data.isCompleted = true;
    setLoading(true);
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
            router.replace(router.asPath);
            setStatus('completed');
            setLoading(false);
            return;
        }
        toast({
            title: result.message,
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
        setLoading(false);
    } catch (error) {
        toast({
            title: `Check your network connection and try again`,
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
        setLoading(false);
    }
    return;
}
