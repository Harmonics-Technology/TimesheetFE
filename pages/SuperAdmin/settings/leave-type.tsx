import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LeaveType } from '@components/subpages/LeaveType';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    LeaveService,
    LeaveTypeViewPagedCollectionStandardResponse,
} from 'src/services';

interface leavesProps {
    leaves: LeaveTypeViewPagedCollectionStandardResponse;
}
function leaveType({ leaves }: leavesProps) {
    return <LeaveType leaves={leaves} />;
}

export default leaveType;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await LeaveService.leaveTypes(
                pagingOptions.offset,
                pagingOptions.limit,
            );
            return {
                props: {
                    leaves: data,
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
