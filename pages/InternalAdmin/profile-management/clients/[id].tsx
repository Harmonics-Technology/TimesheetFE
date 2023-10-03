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
}

function ClientDetails({
    userProfile,
    teamList,
    supervisorList,
    id,
}: pageOptions) {
    return (
        <ClientProfile
            userProfile={userProfile}
            teamList={teamList}
            supervisorList={supervisorList}
            id={id}
        />
    );
}

export default ClientDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        //
        const pagingOptions = filterPagingSearchOptions(ctx);
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
            //
            return {
                props: {
                    userProfile: data.data,
                    teamList,
                    supervisorList,
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
