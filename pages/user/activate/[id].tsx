import ActivateUserPage from '@components/bits-utils/ActivateUserPage';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UserView } from 'src/services';

interface pageOptions {
    user: UserView;
    supervisor: UserView[];
    paymentPartner: UserView[];
}

function ActivateUser({ user, supervisor, paymentPartner }: pageOptions) {
    return (
        <ActivateUserPage
            userProfile={user}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
        />
    );
}

export default ActivateUser;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        try {
            const data = await UserService.getUserById(id);
            const paymentPartner = await UserService.listUsers(
                'payment partner',
            );
            const clientId =
                data?.data?.employeeInformation?.supervisor?.client?.id;
            console.log({ clientId });
            const supervisor = await UserService.getClientSupervisors(
                0,
                18,
                '',
                clientId,
            );

            return {
                props: {
                    user: data.data,
                    paymentPartner: paymentPartner?.data?.value,
                    supervisor: supervisor?.data?.value,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    user: {},
                },
            };
        }
    },
);
