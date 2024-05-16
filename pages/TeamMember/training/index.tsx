import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { TeamAllTraning } from '@components/subpages/Training/TeamAllTraining';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const index = ({ trainings }) => {
    return <TeamAllTraning trainings={trainings} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
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
