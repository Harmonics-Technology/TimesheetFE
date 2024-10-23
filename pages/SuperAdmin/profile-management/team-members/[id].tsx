import { withPageAuth } from '@components/generics/withPageAuth';
import TeamProfile from '@components/subpages/TeamProfile';
import { GetServerSideProps } from 'next';
import {
    DepartmentService,
    OnboardingFeeService,
    UserService,
    UserView,
    UtilityService,
} from 'src/services';

interface pageOptions {
    userProfile: any;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
    department: any;
    currencies: any;
    subs: any;
    fees?: any;
}

function TeamDetails({
    userProfile,
    clients,
    supervisor,
    paymentPartner,
    id,
    department,
    currencies,
    subs,
    fees,
}: pageOptions) {
    return (
        <TeamProfile
            userProfile={userProfile}
            clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
            id={id}
            isSuperAdmin
            currencies={currencies}
            department={department}
            subs={subs}
            fees={fees}
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
            const clients = await UserService.listUsers('client', superAdminId);
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
            );
            const clientId =
                data?.data?.employeeInformation?.client?.id ||
                data?.data?.employeeInformation?.supervisor?.employeeInformation
                    ?.client?.id;
            const paymentId = data.data?.employeeInformation?.paymentPartnerId;
            //
            const supervisor = await UserService.listClentAndSupervisors(
                clientId as string,
            );
            const department = await DepartmentService.listDepartments(
                superAdminId,
            );
            const currencies = await UtilityService.listCountries();
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const fees = await OnboardingFeeService.listOnboardingFee(
                0,
                10,
                paymentId as string,
            );
            //
            return {
                props: {
                    userProfile: data.data,
                    paymentPartner: paymentPartner?.data?.value,
                    supervisor: supervisor?.data,
                    id,
                    department: department.data,
                    currencies: currencies.data,
                    subs: subs.data,
                    clients: clients.data?.value,
                    fees: fees?.data?.value,
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
