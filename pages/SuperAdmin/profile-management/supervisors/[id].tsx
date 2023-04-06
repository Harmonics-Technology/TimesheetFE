import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminProfile from '@components/subpages/AdminProfile';
import SupervisorProfile from '@components/subpages/SupervisorProfile';
import { GetServerSideProps } from 'next';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface pageOptions {
    userProfile: any;
    teamList: UserViewPagedCollectionStandardResponse;
}

function AdminDetails({ userProfile, teamList }: pageOptions) {
    return <SupervisorProfile userProfile={userProfile} teamList={teamList} />;
}

export default AdminDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const pagingOptions = filterPagingSearchOptions(ctx);
        // ({ id });
        try {
            const data = await UserService.getUserById(id);
            const teamList = await UserService.getSupervisees(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
                pagingOptions.from,
                pagingOptions.to,
            );
            // ({ data });
            return {
                props: {
                    userProfile: data.data,
                    teamList,
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
