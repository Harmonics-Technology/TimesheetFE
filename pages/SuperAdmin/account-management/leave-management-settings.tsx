import { Box } from '@chakra-ui/react';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LeaveManagementSettings } from '@components/subpages/LeaveManagementSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ControlSettingView,
    LeaveConfigurationView,
    LeaveService,
    LeaveTypeViewPagedCollectionStandardResponse,
    UserService,
} from 'src/services';


interface leavesProps {
    leaves: LeaveTypeViewPagedCollectionStandardResponse;
    leaveConfiguration: LeaveConfigurationView;
    controls: ControlSettingView;
}

const LeaveManagets = ({
    leaves,
    leaveConfiguration,
    controls,
}: leavesProps) => {
    return (
        <LeaveManagementSettings
            leaves={leaves}
            leaveConfiguration={leaveConfiguration}
            controls={controls}
        />
    );
};

export default LeaveManagets;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await LeaveService.leaveTypes(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
            );
            const leaveConfiguration = await LeaveService.getLeaveConfiguration(
                superAdminId,
            );
            const controlSettings = await UserService.getControlSettingById(
                superAdminId,
            );
            return {
                props: {
                    leaves: data,
                    leaveConfiguration: leaveConfiguration.data,
                    controls: controlSettings.data,
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
