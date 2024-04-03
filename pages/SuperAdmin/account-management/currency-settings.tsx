// import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { DepartmentPage } from '@components/subpages/DepartmentPage';
import { OrganizationCurrency } from '@components/subpages/OrganizationCurrency';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService, UtilityService } from 'src/services';

const project = ({
    data,
    superAdminId,
    currencies,
}: {
    data: any;
    superAdminId: any;
    currencies: any;
}) => {
    return (
        <OrganizationCurrency
            data={data}
            superAdminId={superAdminId}
            countries={currencies}
        />
    );
};

export default project;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        try {
            const data = await UserService.getControlSettingById(superAdminId);
            const currencies = await UtilityService.listCountries();

            return {
                props: {
                    data: data.data,
                    superAdminId,
                    currencies: currencies.data,
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
