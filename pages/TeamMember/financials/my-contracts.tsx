import { withPageAuth } from '@components/generics/withPageAuth';
import TeamContractList from '@components/subpages/TeamContractList';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ContractService,
    ContractViewPagedCollectionStandardResponse,
} from 'src/services';
interface contractProps {
    contractList: ContractViewPagedCollectionStandardResponse;
}

function contract({ contractList }: contractProps) {
    return <TeamContractList adminList={contractList} />;
}

export default contract;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await ContractService.listTeamMemberContracts(id);
            return {
                props: {
                    contractList: data,
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
