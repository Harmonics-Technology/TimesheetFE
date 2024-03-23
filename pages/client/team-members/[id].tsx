import { withPageAuth } from '@components/generics/withPageAuth';
import TeamProfile from '@components/subpages/TeamProfile';
import { GetServerSideProps } from 'next';
import {
    DepartmentService,
    UserService,
    UserView,
    UtilityService,
} from 'src/services';

interface pageOptions {
    userProfile: any;
    // clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
    department: any;
    currencies: any;
    subs: any;
}

function TeamDetails({
    userProfile,
    // clients,
    supervisor,
    paymentPartner,
    id,
    department,
    currencies,
    subs,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            // clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
            id={id}
            currencies={currencies}
            department={department}
            subs={subs}
        />
    );
}

export default TeamDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getUserById(id);
            // const clients = await UserService.listUsers('client');
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
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
            const department = await DepartmentService.listDepartments(
                superAdminId,
            );
            const currencies = await UtilityService.listCountries();
            const subs = await UserService.getClientSubScriptions(superAdminId);
            //
            return {
                props: {
                    userProfile: data.data,
                    paymentPartner: paymentPartner?.data?.value,
                    supervisor: supervisor?.data?.value,
                    id,
                    department: department.data,
                    currencies: currencies.data,
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
