import React from 'react';
import LeaveSettingsComponent from '../../../src/components/subpages/LeaveSettings';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { LeaveConfigurationView, LeaveService } from 'src/services';

interface leavesProps {
    leaveConfiguration?: LeaveConfigurationView;
}

const LeaveSettings = ({ leaveConfiguration }: leavesProps) => {
    return <LeaveSettingsComponent leaveConfiguration={leaveConfiguration} />;
};

export default LeaveSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const leaveConfiguration = await LeaveService.getLeaveConfiguration(
                superAdminId,
            );

            return {
                props: {
                    leaveConfiguration: leaveConfiguration.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    leaveConfiguration: {},
                },
            };
        }
    },
);
