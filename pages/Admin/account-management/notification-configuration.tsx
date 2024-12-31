import { AdminNotificationConfiguration } from '@components/bits-utils/NotificationConfigurations/SuperAdmin';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserSettingService } from 'src/services';

const NotificationSettings = ({ data }: { data: any }) => {
    return <AdminNotificationConfiguration controls={data} isAdmin={false} />;
};

export default NotificationSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserSettingService.getAdminSettingById(userId);
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
