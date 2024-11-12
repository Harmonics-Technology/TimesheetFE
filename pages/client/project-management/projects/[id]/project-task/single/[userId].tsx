import { withPageAuth } from '@components/generics/withPageAuth';
import { SingleProfileView } from '@components/subpages/SingleProfileView';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UserView } from 'src/services';

function index({ user }: { user: UserView }) {
    return <SingleProfileView user={user} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { userId } = ctx.query;

        try {
            const data = await UserService.getUserById(userId);
            return {
                props: {
                    user: data.data,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
