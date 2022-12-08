import { filterPagingSearchOptions } from "@components/generics/filterPagingSearchOptions";
import { withPageAuth } from "@components/generics/withPageAuth";
import ProfileManagementAdmin from "@components/subpages/ProfileManagementAdmin";
import { GetServerSideProps } from "next";
import React from "react";
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from "src/services";
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
}

function admin({ adminList }: adminProps) {
    return <ProfileManagementAdmin adminList={adminList} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await UserService.listUsers(
                "admin",
                pagingOptions.offset,
                pagingOptions.limit,
            );
            return {
                props: {
                    adminList: data,
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
