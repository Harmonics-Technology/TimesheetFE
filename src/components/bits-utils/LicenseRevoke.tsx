import React, { useState } from 'react';
import { ShiftBtn } from './ShiftBtn';
import { useToast } from '@chakra-ui/react';
import { UserService } from 'src/services';
import { useRouter } from 'next/router';

export const LicenseRevoke = ({
    text,
    userId,
    w,
    h,
    disabled,
    setSelectedLicense,
}: {
    text: any;
    userId: any;
    h?: any;
    w?: any;
    disabled?: any;
    setSelectedLicense?: any;
}) => {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const revokeUserLicense = async () => {
        setLoading(true);
        try {
            const data = await UserService.revokeUserLicense(userId);
            if (data.status) {
                setLoading(false);
                router.replace(router.asPath);
                setSelectedLicense && setSelectedLicense({});
                toast({
                    title: 'Action successful',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                return;
            }
            setLoading(false);
            toast({
                title: data.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <ShiftBtn
            onClick={revokeUserLicense}
            disabled={disabled}
            h={h}
            w={w}
            text={text}
            loading={loading}
        />
    );
};
