import { withPageAuth } from '@components/generics/withPageAuth';
import EditDraft from '@components/subpages/EditDraft';
import { GetServerSideProps } from 'next';
import { DraftService, UserService, UserView } from 'src/services';

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
        <EditDraft
            userProfile={userProfile}
            clients={clients}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
            id={id}
            isSuperAdmin
        />
    );
}

export default TeamDetails;

// export const getServerSideProps: GetServerSideProps = withPageAuth(
//     async (ctx: any) => {
//         const { id } = ctx.query;
//         const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
//         try {
//             const data = await DraftService.getUserById(id);
//             const clients = await UserService.listUsers('client', superAdminId);
//             const paymentPartner = await UserService.listUsers(
//                 'payment partner',
//             );
//             const clientId =
//                 data?.data?.employeeInformation?.client?.id ||
//                 data?.data?.employeeInformation?.supervisor?.employeeInformation
//                     ?.client?.id;
//             //
//             const supervisor = await UserService.getClientSupervisors(
//                 0,
//                 18,
//                 '',
//                 clientId,
//             );
//             //
//             return {
//                 props: {
//                     userProfile: data.data,
//                     paymentPartner: paymentPartner?.data?.value,
//                     supervisor: supervisor?.data?.value,
//                     clients,
//                     id,
//                 },
//             };
//         } catch (error: any) {
//             return {
//                 props: {
//                     data: [],
//                 },
//             };
//         }
//     },
// );
