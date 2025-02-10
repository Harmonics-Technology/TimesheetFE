import { TeamNotificationConfiguration } from '@components/bits-utils/NotificationConfigurations/TeamMember';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserSettingService } from 'src/services';

const NotificationSettings = ({ data }: { data: any }) => {
    return <TeamNotificationConfiguration controls={data} />;
};

export default NotificationSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserSettingService.getTeamMemberSettingById(
                userId,
            );
            return {
                props: {
                    data: { ...data.data, userId },
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
