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

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await ContractService.listContracts();
        return {
            props: {
                adminList: data,
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
});
