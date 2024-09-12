import { withPageAuth } from '@components/generics/withPageAuth';
import { TrainingManagerSettings } from '@components/subpages/Training/TrainingManagerSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const TrainingManager = ({
    data,
    superAdminId,
}: {
    data: any;
    superAdminId: string;
}) => {
    return <TrainingManagerSettings data={data} superAdminId={superAdminId} />;
};

export default TrainingManager;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;

        try {
            const data = await TrainingService.getTrainingManagers(
                superAdminId,
            );
            return {
                props: {
                    data: data.data,
                    superAdminId,
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
