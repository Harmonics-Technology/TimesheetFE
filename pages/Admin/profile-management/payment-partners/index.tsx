import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerManagement from '@components/subpages/PaymentPartnerManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
    UtilityService,
} from 'src/services';
interface PaymentPartnerProps {
    PaymentPartnerList: UserViewPagedCollectionStandardResponse;
    subs: any;
    currencies: any;
}

function PaymentPartner({
    PaymentPartnerList,
    subs,
    currencies,
}: PaymentPartnerProps) {
    //
    return (
        <PaymentPartnerManagement
            adminList={PaymentPartnerList}
            subs={subs}
            currencies={currencies}
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
            const currencies = await UtilityService.listCountries();

            return {
                props: {
                    PaymentPartnerList: data,
                    subs: subs.data,
                    currencies: currencies.data,
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
