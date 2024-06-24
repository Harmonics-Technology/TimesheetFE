import { withPageAuth } from '@components/generics/withPageAuth';
import AdminProfile from '@components/subpages/AdminProfile';
import SuperadminProfile from '@components/subpages/SuperAdminManagement';
import { GetServerSideProps } from 'next';
import { UserService } from 'src/services';
interface pageOptions {
    userProfile: any;
    subs: any;
}

function AdminDetails({ userProfile, subs }: pageOptions) {
    return <SuperadminProfile userProfile={userProfile} subs={subs} />;
}

export default AdminDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        //
        try {
            const data = await UserService.getUserById(id);
            const subs = await UserService.getClientSubScriptions(superAdminId);
            //
            return {
                props: {
                    userProfile: data.data,
                    subs: subs.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
