import { UserService } from 'src/services';

export const fetchAllUser = async ({
    role,
    limit,
    search,
    setLoading,
    superAdminId,
    setUsers,
}) => {
    setLoading({ id: 'fetching user' });
    try {
        const res = await UserService.listUsers(
            role,
            superAdminId,
            0,
            limit,
            search,
        );
        if (res?.status) {
            setLoading({ id: '' });
            setUsers(res?.data);
            return;
        }
        setLoading({ id: '' });
    } catch (error: any) {
        alert(error?.body?.message || error?.message);
        setLoading({ id: '' });
    }
};
export const fetchAllUserRoles = async ({
    role,
    setLoading,
    superAdminId,
    setUsers,
}) => {
    setLoading({ id: 'fetching user' });
    try {
        const res = await UserService.listUsersByRoles(superAdminId, role);
        if (res?.status) {
            setLoading({ id: '' });
            setUsers(res?.data);
            return;
        }
        setLoading({ id: '' });
    } catch (error: any) {
        alert(error?.body?.message || error?.message);
        setLoading({ id: '' });
    }
};
