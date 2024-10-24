import { withPageAuth } from '@components/generics/withPageAuth';
import { ViewTraining } from '@components/subpages/Training/ViewTraining';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService, UserService } from 'src/services';

const index = ({ data, id, users }) => {
    const tabs = [
        {
            text: 'My Training',
            url: `/training`,
        },
        {
            text: 'Training Materials',
            url: `/training/material`,
        },
        {
            text: 'Training Status',
            url: `/training/status`,
        },
    ];
    return <ViewTraining id={id} data={data} users={users} tabs={tabs} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const { id } = ctx.query;
        try {
            const data = await TrainingService.listTraining(
                0,
                1,
                superAdminId,
                id,
                '',
                undefined,
                undefined,
                userId,
            );
            const users = await UserService.listUsers({
                role: 'Team Member',
                superAdminId,
                offset: 0,
                limit: 80,
            });

            return {
                props: {
                    data: data.data?.value?.at(0),
                    users: users?.data,
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
