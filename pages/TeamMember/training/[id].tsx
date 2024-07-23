import { withPageAuth } from '@components/generics/withPageAuth';
import { TeamViewTraining } from '@components/subpages/Training/TeamViewTraining';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TrainingService } from 'src/services';

const singleTraining = ({ training, userId, id, isManager }) => {
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
        <TeamViewTraining
            training={training}
            userId={userId}
            trainingId={id}
            tabs={isManager ? tabs : tabs?.slice(0, 1)}
        />
    );
};

export default singleTraining;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const isManager = JSON.parse(ctx.req.cookies.user)?.isTrainingManager;
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
                    isManager: isManager || false,
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
