import { withPageAuth } from '@components/generics/withPageAuth';
import AdminProfile from '@components/subpages/AdminProfile';
import SupervisorProfile from '@components/subpages/ClientSupervisorProfile';
import { GetServerSideProps } from 'next';
import { UserService } from 'src/services';
interface pageOptions {
    userProfile: any;
}

function AdminDetails({ userProfile }: pageOptions) {
    return <SupervisorProfile userProfile={userProfile} />;
}

export default AdminDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        //
        try {
            const data = await UserService.getUserById(id);
            //
            return {
                props: {
                    userProfile: data.data,
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
