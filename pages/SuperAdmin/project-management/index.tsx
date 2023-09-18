import { GetServerSideProps } from 'next';
import React from 'react';

const invoices = () => {
    return <div>invoices</div>;
};

export default invoices;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const role = JSON.parse(ctx.req.cookies.user).role.replaceAll(' ', '');
    //
    return {
        redirect: {
            permanent: false,
            destination: `/${role}/project-management/dashboard`,
        },
        props: {},
    };
};
