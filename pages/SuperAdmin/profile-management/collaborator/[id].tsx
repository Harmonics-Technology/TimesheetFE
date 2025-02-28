import { withPageAuth } from '@components/generics/withPageAuth';
import { CollaboratorProfile } from '@components/subpages/Collaborator/CollaboratorProfile';
import { GetServerSideProps } from 'next';
import { UserService } from 'src/services';
interface pageOptions {
    userProfile: any;
    subs: any;
}

function AdminDetails({ userProfile, subs }: pageOptions) {
    return <CollaboratorProfile userProfile={userProfile} subs={subs} />;
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
