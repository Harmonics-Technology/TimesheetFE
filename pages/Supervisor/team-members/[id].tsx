import { withPageAuth } from '@components/generics/withPageAuth';
import TeamProfile from '@components/subpages/TeamProfile';
import { GetServerSideProps } from 'next';
import { UserService, UserView } from 'src/services';

interface pageOptions {
    userProfile: any;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
}

function TeamDetails({
    userProfile,
    clients,
    supervisor,
    paymentPartner,
    id,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            // clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
            id={id}
        />
    );
}

export default TeamDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        // console.log({ id });
        try {
            const data = await UserService.getUserById(id);
            const clients = await UserService.listUsers('client', superAdminId);
            const supervisor = await UserService.listUsers(
                'supervisor',
                superAdminId,
            );
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
            );
            console.log({ data });
            return {
                props: {
                    userProfile: data.data,
                    clients: clients?.data?.value,
                    supervisor: supervisor?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
                    id,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
