import { withPageAuth } from '@components/generics/withPageAuth';
import TeamProfile from '@components/subpages/TeamProfile';
import { GetServerSideProps } from 'next';
import { UserService, UserView } from 'src/services';

interface pageOptions {
    userProfile: any;
    // clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
}

function TeamDetails({
    userProfile,
    // clients,
    supervisor,
    paymentPartner,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            // clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
        />
    );
}

export default TeamDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        try {
            const data = await UserService.getUserById(id);
            // const clients = await UserService.listUsers('client');
            const paymentPartner = await UserService.listUsers(
                'payment partner',
            );
            const clientId =
                data?.data?.employeeInformation?.client?.id ||
                data?.data?.employeeInformation?.supervisor?.employeeInformation
                    ?.client?.id;
            // ({ clientId });
            const supervisor = await UserService.getClientSupervisors(
                0,
                18,
                '',
                clientId,
            );
            // ({ supervisor: supervisor.data?.value });
            return {
                props: {
                    userProfile: data.data,
                    paymentPartner: paymentPartner?.data?.value,
                    supervisor: supervisor?.data?.value,
                },
            };
        } catch (error: any) {
            (error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
