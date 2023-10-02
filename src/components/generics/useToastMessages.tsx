import { useToast } from '@chakra-ui/react';

export function useToastMessages() {
    const toast = useToast();

    const showToastSuccess = (title) => {
        toast({
            title,
            status: 'success',
            isClosable: true,
            position: 'top-right',
        });
    };

    const showToastError = (title) => {
        toast({
            title,
            status: 'error',
            isClosable: true,
            position: 'top-right',
        });
    };

    return {
        showToastSuccess,
        showToastError,
    };
}
