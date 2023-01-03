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
}

function ClientDetails({ userProfile, teamList, supervisorList }: pageOptions) {
    return (
        <ClientProfile
            userProfile={userProfile}
            teamList={teamList}
            supervisorList={supervisorList}
        />
    );
}

export default ClientDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        // console.log({ id });
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
            // console.log({ data });
            return {
                props: {
                    userProfile: data.data,
                    teamList,
                    supervisorList,
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
