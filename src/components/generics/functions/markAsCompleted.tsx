import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ProjectManagementService } from 'src/services';

export default async function markAsCompleted(data, setLoading) {
    const toast = useToast();
    const router = useRouter();
    data.isCompleted = true;
    setLoading(true);
    try {
        const result =
            await ProjectManagementService.markProjectOrTaskAsCompleted(data);
        if (result.status) {
            toast({
                title: 'Profile Update Success',
                status: 'success',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
            router.reload();
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
}
