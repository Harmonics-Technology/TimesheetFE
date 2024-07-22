import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { TeamAllTraning } from '@components/subpages/Training/TeamAllTraining';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const index = ({ trainings, isManager }) => {
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
    return (
        <TeamAllTraning
            trainings={trainings}
            tabs={isManager ? tabs : tabs?.slice(0, 1)}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const isManager = JSON.parse(ctx.req.cookies.user)?.isTrainingManager;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const trainings = await TrainingService.listUserTrainings(
                pagingOptions.offset,
                pagingOptions.limit,
                userId,
            );
            return {
                props: {
                    trainings: trainings.data,
                    isManager: isManager || false,
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
