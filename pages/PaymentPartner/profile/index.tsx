import { withPageAuth } from '@components/generics/withPageAuth';
import MyProfile from '@components/subpages/MyProfile';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ControlSettingView, UserService, UserView } from 'src/services';

function index({
    user,
    controls,
}: {
    user: UserView;
    controls: ControlSettingView;
}) {
    return <MyProfile user={user} controls={controls} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getUserById(id);
            const controls = await UserService.getControlSettingById(
                superAdminId,
            );
            return {
                props: {
                    user: data.data,
                    controls: controls.data,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
