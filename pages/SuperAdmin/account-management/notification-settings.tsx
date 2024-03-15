import { NotifocationSettingsPage } from '@components/bits-utils/NotifocationSettingsPage';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const NotificationSettings = ({ data }: { data: any }) => {
    return <NotifocationSettingsPage controls={data} />;
};

export default NotificationSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getControlSettingById(superAdminId);
            return {
                props: {
                    data: data.data,
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
