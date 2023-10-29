import { useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import Cookies from 'js-cookie';
import moment from 'moment';
import { createContext } from 'react';

export const UserContext = createContext<any | null>(null);
export const UserProvider = ({ children }: { children: any }) => {
    let user;
    let subType;
    let activeSub;
    let accessControls;
    const users = Cookies.get('user') as unknown as string;
    if (users !== undefined) {
        user = JSON.parse(users);
        subType = JSON.parse(users)
            ?.subscriptiobDetails?.data?.subscription?.name?.split(' ')[0]
            ?.toLowerCase();
        const daysLeft = moment(
            JSON.parse(users)?.subscriptiobDetails?.data?.endDate,
        ).diff(moment(), 'day');
        activeSub =
            JSON.parse(users)?.subscriptiobDetails?.data?.status == 'ACTIVE' &&
            daysLeft > 0
                ? true
                : false;
    }
    const access = Cookies.get('access-controls') as unknown as string;
    if (users !== undefined && access !== undefined) {
        accessControls = JSON.parse(access);
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
                }}
            >
                {children}
            </UserContext.Provider>
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};
