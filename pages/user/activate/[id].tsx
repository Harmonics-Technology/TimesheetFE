import ActivateUserPage from '@components/bits-utils/ActivateUserPage';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UserView } from 'src/services';

interface pageOptions {
    user: UserView;
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
}

function ActivateUser({ user, supervisor, paymentPartner, id }: pageOptions) {
    return (
        <ActivateUserPage
            userProfile={user}
            supervisor={supervisor}
            paymentPartner={paymentPartner}
            id={id}
        />
    );
}

export default ActivateUser;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        try {
            const data = await UserService.getUserById(id);
            const paymentPartner = await UserService.listUsers({
                role: 'payment partner',
            });
            const clientId =
                data?.data?.employeeInformation?.supervisor?.client?.id;

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
                    id,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    user: {},
                },
            };
        }
    },
);
