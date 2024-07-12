import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ClientProfile from '@components/subpages/ClientProfile';
import { GetServerSideProps } from 'next';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';

interface pageOptions {
    userProfile: any;
    teamList: UserViewPagedCollectionStandardResponse;
    supervisorList: UserViewPagedCollectionStandardResponse;
    id: any;
    subs: any;
}

function ClientDetails({
    userProfile,
    teamList,
    supervisorList,
    id,
    subs,
}: pageOptions) {
    return (
        <ClientProfile
            userProfile={userProfile}
            teamList={teamList}
            supervisorList={supervisorList}
            id={id}
            subs={subs}
        />
    );
}

export default ClientDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        //
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getUserById(id);
            const teamList = await UserService.getClientTeamMembers(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
            );
            const supervisorList = await UserService.getClientSupervisors(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            //
            return {
                props: {
                    userProfile: data.data,
                    teamList,
                    supervisorList,
                    id,
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
