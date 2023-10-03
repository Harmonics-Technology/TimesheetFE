import { withPageAuth } from '@components/generics/withPageAuth';
import { SecurityInformation } from '@components/subpages/SecurityInformation';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ControlSettingView, UserService } from 'src/services';

const SecurityInfo = ({ controls }: { controls: ControlSettingView }) => {
    return <SecurityInformation controls={controls} />;
};

export default SecurityInfo;

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
