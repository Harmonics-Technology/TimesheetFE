import { withPageAuth } from '@components/generics/withPageAuth';
import { TeamViewTraining } from '@components/subpages/Training/TeamViewTraining';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const singleTraining = ({ training, userId, id }) => {
    return (
        <TeamViewTraining training={training} userId={userId} trainingId={id} />
    );
};

export default singleTraining;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const { id } = ctx.query;
        try {
            const training = await TrainingService.listUserTrainingMaterials(
                userId,
                id,
            );
            return {
                props: {
                    training: training.data,
                    userId,
                    id,
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
