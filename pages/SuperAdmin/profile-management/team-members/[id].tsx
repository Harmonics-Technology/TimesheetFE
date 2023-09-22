import { withPageAuth } from '@components/generics/withPageAuth';
import TeamProfile from '@components/subpages/TeamProfile';
import { GetServerSideProps } from 'next';
import { UserService, UserView } from 'src/services';

interface pageOptions {
    userProfile: any;
    // clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
}

function TeamDetails({
    userProfile,
    // clients,
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
            //
            const supervisor = await UserService.getClientSupervisors(
                0,
                18,
                '',
                clientId,
            );
            //
            return {
                props: {
                    userProfile: data.data,
                    paymentPartner: paymentPartner?.data?.value,
                    supervisor: supervisor?.data?.value,
                    id,
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
