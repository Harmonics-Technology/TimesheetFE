import { NotificationConfiguration } from '@components/bits-utils/NotificationConfiguration';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const NotificationSettings = ({ data }: { data: any }) => {
    return <NotificationConfiguration controls={data} isAdmin={false} />;
};

export default NotificationSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserService.getTeamMemberSettingById(userId);
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
