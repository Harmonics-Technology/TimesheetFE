import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { TrainingStatusById } from '@components/subpages/Training/TrainingStatusById';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const index = ({ trainings, trainingName }) => {
    return (
        <TrainingStatusById trainings={trainings} trainingName={trainingName} />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const { id } = ctx.query;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { trainingName } = ctx.query;
        try {
            const data = await TrainingService.listTrainingStatus(
                pagingOptions.offset,
                pagingOptions.limit,
                id,
            );

            return {
                props: {
                    trainings: data.data,
                    trainingName,
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
