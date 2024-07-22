import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { TrainingStatus } from '@components/subpages/Training/TrainingStatus';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const index = ({ trainings }) => {
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
    return <TrainingStatus trainings={trainings} tabs={tabs} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
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
