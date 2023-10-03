import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SupervisorTeamMember from '@components/subpages/SupervisorTeamMember';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UserView } from 'src/services';
interface TeamProps {
    teamList: UserView[];
    id: string;
    paymentPartner: UserView[];
}

function Team({ teamList, id, paymentPartner }: TeamProps) {
    return (
        <SupervisorTeamMember
            adminList={teamList}
            id={id}
            paymentPartner={paymentPartner}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).id;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
            );
            const data = await UserService.getSupervisees(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
                pagingOptions.from,
                pagingOptions.to,
            );

            return {
                props: {
                    teamList: data,
                    id: id,
                    paymentPartner: paymentPartner?.data?.value,
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
