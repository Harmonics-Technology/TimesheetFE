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
}

function PaymentPartner({ PaymentPartnerList }: PaymentPartnerProps) {
    // ({ PaymentPartner });
    return <PaymentPartnerManagement adminList={PaymentPartnerList} />;
}

export default PaymentPartner;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await UserService.listUsers(
                'payment partner',
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    PaymentPartnerList: data,
                },
            };
        } catch (error: any) {
            (error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
