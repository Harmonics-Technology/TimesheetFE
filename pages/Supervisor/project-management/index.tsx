import { GetServerSideProps } from 'next';
import React from 'react';

const invoices = () => {
    return <div>invoices</div>;
};

export default invoices;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const role = JSON.parse(ctx.req.cookies.user).role.replaceAll(' ', '');
    const sub = JSON.parse(
        ctx.req.cookies.subDetails,
    )?.data?.subscription?.name?.toLowerCase();
    console.log({ sub });
    //
    return {
        redirect: {
            permanent: false,
            destination:
                sub == 'basic'
                    ? `/${role}/project-management/projects`
                    : `/${role}/project-management/dashboard`,
        },
        props: {},
    };
};
