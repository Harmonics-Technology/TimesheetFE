import { withPageAuth } from '@components/generics/withPageAuth';
import { AccessControlSettings } from '@components/subpages/AccessControlSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ControlSettingView, UserService } from 'src/services';

const AccessSettings = ({ controls }: { controls: ControlSettingView }) => {
    return <AccessControlSettings controls={controls} />;
};

export default AccessSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getControlSettingById(id);

            return {
                props: {
                    controls: data.data,
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
