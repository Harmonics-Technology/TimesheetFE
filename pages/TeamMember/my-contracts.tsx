import { withPageAuth } from '@components/generics/withPageAuth';
import TeamContractList from '@components/subpages/TeamContractList';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UserViewStandardResponse } from 'src/services';
interface contractProps {
    contractList: UserViewStandardResponse;
}

function contract({ contractList }: contractProps) {
    return <TeamContractList adminList={contractList} />;
}

export default contract;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserService.getUserById(id);
            return {
                props: {
                    contractList: data,
                },
            };
        } catch (error: any) {
            error;
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
