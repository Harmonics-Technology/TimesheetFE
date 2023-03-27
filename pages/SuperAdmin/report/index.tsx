import { withPageAuth } from '@components/generics/withPageAuth';
import { Reports } from '@components/subpages/Reports';
import { GetServerSideProps } from 'next';
import React from 'react';
import { DashboardService } from 'src/services';

const index = ({ metrics }) => {
    return <Reports metrics={metrics} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await DashboardService.getAdminMetrics();
        return {
            props: {
                metrics: data,
            },
        };
    } catch (error: any) {
        return {
            props: {
                data: [],
            },
        };
    }
});
