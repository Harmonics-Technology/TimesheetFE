import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { AllTraning } from '@components/subpages/Training/AllTraning';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService, UserService } from 'src/services';

const index = ({ users, trainings, superAdminId }) => {
    const tabs = [
        {
            text: 'Training Materials',
            url: `/training/material`,
        },
        {
            text: 'Training Status',
            url: `/training/status`,
        },
    ];
    return (
        <AllTraning
            users={users}
            trainings={trainings}
            superAdminId={superAdminId}
            tabs={tabs}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            const trainings = await TrainingService.listTraining(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                undefined,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    users: users.data,
                    superAdminId,
                    trainings: trainings.data,
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
