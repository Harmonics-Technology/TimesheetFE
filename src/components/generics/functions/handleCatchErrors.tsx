import { useToast } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

function handleCatchErrors(error) {
    const toast = useToast();
    const router = useRouter();
    useEffect(() => {
        if (error) {
            if (error.body.statusCode == 401) {
                toast({
                    position: 'top-right',
                    title: error.body.message,
                    status: 'error',
                });
                Cookies.remove('token');
                router.push(
                    `/login?from=${encodeURIComponent(error.request.url)}`,
                );
            } else {
                toast({
                    position: 'top-right',
                    title: error.body.message,
                    status: 'error',
                });
            }
            return;
        }
    }, []);
}

export default handleCatchErrors;
