import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerManagement from '@components/subpages/PaymentPartnerManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface PaymentPartnerProps {
    PaymentPartnerList: UserViewPagedCollectionStandardResponse;
    subs: any;
}

function PaymentPartner({ PaymentPartnerList, subs }: PaymentPartnerProps) {
    //
    return (
        <PaymentPartnerManagement
            adminList={PaymentPartnerList}
            isSuperAdmin
            subs={subs}
        />
    );
}

export default PaymentPartner;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.listUsers(
                'payment partner',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            return {
                props: {
                    PaymentPartnerList: data,
                    subs: subs.data,
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
