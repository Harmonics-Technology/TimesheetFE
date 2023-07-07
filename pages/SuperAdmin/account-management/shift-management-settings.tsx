import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { ShiftManagementSettings } from '@components/subpages/ShiftManagementSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ShiftService, UserService } from 'src/services';

const ShiftManagements = ({ shifts, controls }) => {
    return <ShiftManagementSettings shifts={shifts} controls={controls} />;
};

export default ShiftManagements;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await ShiftService.listShiftTypes(superAdminId);
            const controlSettings = await UserService.getControlSettingById(
                superAdminId,
            );

            return {
                props: {
                    shifts: data || [],
                    controls: controlSettings.data,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
