import { useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext<any | null>(null);
export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState();
    const [subType, setSubType] = useState<any>();
    const [activeSub, setActiveSub] = useState(false);
    const { isOpen, onOpen: opens, onClose } = useDisclosure();
    useEffect(() => {
        const users = Cookies.get('user') as unknown as string;
        if (users !== undefined) {
            setUser(JSON.parse(users));
            const subType = JSON.parse(users)
                ?.subscriptiobDetails?.data?.subscription?.name?.split(' ')[0]
                ?.toLowerCase();
            setSubType('basic');
            setActiveSub(
                JSON.parse(users)?.subscriptiobDetails?.data?.status == 'ACTIVE'
                    ? true
                    : false,
            );
        }
    }, []);
    // console.log({ activeSub });
    return (
        <>
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    subType,
                    activeSub,
                    setSubType,
                    opens,
                }}
            >
                {children}
            </UserContext.Provider>
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};
