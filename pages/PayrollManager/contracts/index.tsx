import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ContractList from '@components/subpages/ContractList';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ContractService,
    ContractViewPagedCollectionStandardResponse,
} from 'src/services';
interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
}

function admin({ adminList }: adminProps) {
    return <ContractList adminList={adminList} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await ContractService.listContracts(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    adminList: data,
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
