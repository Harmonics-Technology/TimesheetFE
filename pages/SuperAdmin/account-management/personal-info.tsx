import { withPageAuth } from '@components/generics/withPageAuth';
import { AdminNewProfile } from '@components/subpages/AdminNewProfile';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const PersonalInfo = ({ data }) => {
    return <AdminNewProfile data={data} />;
};

export default PersonalInfo;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserService.getUserById(id);

            return {
                props: {
                    data: data.data,
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
