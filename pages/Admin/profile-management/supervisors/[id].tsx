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
    subs: any;
}

function AdminDetails({ userProfile, teamList, subs }: pageOptions) {
    return (
        <SupervisorProfile
            userProfile={userProfile}
            teamList={teamList}
            subs={subs}
        />
    );
}

export default AdminDetails;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        //
        try {
            const data = await UserService.getUserById(id);
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const teamList = await UserService.getSupervisees(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
                pagingOptions.from,
                pagingOptions.to,
            );
            //
            return {
                props: {
                    userProfile: data.data,
                    teamList,
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
