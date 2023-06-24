import { useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext<any | null>(null);
export const UserProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState();
    const [subType, setSubType] = useState();
    const [addons, setAddons] = useState();
    const { isOpen, onOpen: opens, onClose } = useDisclosure();
    // console.log({ user });
    useEffect(() => {
        const users = Cookies.get('user') as unknown as string;
        if (users !== undefined) {
            setUser(JSON.parse(users));
            setSubType(
                JSON.parse(
                    users,
                )?.subscriptiobDetails?.data?.baseSubscription?.name?.toLowerCase(),
            );
            setAddons(
                JSON.parse(users)?.subscriptiobDetails?.data?.addOns?.map((x) =>
                    x.addOnSubscription.name.toLowerCase(),
                ),
            );
        }
    }, []);
    return (
        <>
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    subType,
                    addons,
                    setSubType,
                    setAddons,
                    opens,
                }}
            >
                {children}
            </UserContext.Provider>
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};
