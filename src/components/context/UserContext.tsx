import { useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import Cookies from 'js-cookie';
import moment from 'moment';
import { createContext } from 'react';

export const UserContext = createContext<any | null>(null);
export const UserProvider = ({ children }: { children: any }) => {
    let user;
    let subType;
    let activeSub = true;
    let accessControls;
    let subDetails;
    const users = Cookies.get('user') as unknown as string;
    const subs = Cookies.get('subDetails') as unknown as string;
    const isDev = process.env.NEXT_PUBLIC_ENV == 'development';
    console.log({ isDev });
    if (users !== undefined) {
        user = JSON.parse(users);
    }
    const access = Cookies.get('access-controls') as unknown as string;
    if (users !== undefined && access !== undefined) {
        accessControls = JSON.parse(access);
    }
    if (subs !== undefined) {
        subDetails = JSON.parse(subs);
        subType = subDetails?.data?.subscription?.name
            ?.split(' ')[0]
            ?.toLowerCase();
        const daysLeft = moment(subDetails?.data?.endDate).diff(
            moment(),
            'day',
        );
        activeSub =
            subDetails?.data?.status == 'ACTIVE' && daysLeft >= 0
                ? true
                : isDev
                ? true
                : false;
    }

    const { isOpen, onOpen: opens, onClose } = useDisclosure();

    return (
        <>
            <UserContext.Provider
                value={{
                    user,
                    subType,
                    activeSub,
                    accessControls,
                    opens,
                    subDetails,
                }}
            >
                {children}
            </UserContext.Provider>
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};
